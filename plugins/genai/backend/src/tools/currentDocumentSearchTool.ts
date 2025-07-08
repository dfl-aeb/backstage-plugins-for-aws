/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *   http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  AuthService,
  BackstageCredentials,
  DiscoveryService,
} from '@backstage/backend-plugin-api';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

export function createBackstageCurrentDocumentSearchTool(
  discoveryApi: DiscoveryService,
  auth: AuthService,
) {
  return new DynamicStructuredTool({
    get name() {
      return 'backstageCurrentDocumentSearch';
    },
    description:
      'Searches the current document context in Backstage TechDocs. This tool should be used when the user asks questions about the current document they are viewing. It filters results to the specific entity and document path.',
    schema: z.object({
      query: z.string().describe('Search query for the current document'),
      entityRef: z.string().describe('The entity reference (kind:namespace/name) of the current document'),
      documentPath: z.string().optional().describe('The specific document path within the entity documentation'),
    }),
    func: async ({ query, entityRef, documentPath }, _, toolConfig) => {
      const credentials = toolConfig?.configurable!
        .credentials as BackstageCredentials;

      // Build search URL with entity filter
      let searchUrl = `${await discoveryApi.getBaseUrl(
        'search',
      )}/query?term=${encodeURIComponent(query)}&types[0]=techdocs`;

      // Add entity filter to limit search to current entity
      if (entityRef) {
        searchUrl += `&filters[entity]=${encodeURIComponent(entityRef)}`;
      }

      // If we have a specific document path, we can add it as additional search terms
      if (documentPath) {
        const enhancedQuery = `${query} ${documentPath}`;
        searchUrl = searchUrl.replace(
          `term=${encodeURIComponent(query)}`, 
          `term=${encodeURIComponent(enhancedQuery)}`
        );
      }

      const { token } = await auth.getPluginRequestToken({
        onBehalfOf: credentials,
        targetPluginId: 'search',
      });

      try {
        const response = await fetch(searchUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Search request failed: ${response.statusText}`);
        }

        const searchResults = await response.json();
        
        // Format the results for better LLM consumption
        if (searchResults.results && searchResults.results.length > 0) {
          const formattedResults = searchResults.results
            .slice(0, 10) // Limit to top 10 results
            .map((result: any) => ({
              title: result.title ?? 'Untitled',
              text: result.text ?? '',
              location: result.location ?? '',
              entityRef: result.entityRef ?? entityRef,
            }));

          return JSON.stringify({
            entity: entityRef,
            documentPath: documentPath ?? 'root',
            query: query,
            results: formattedResults,
            resultCount: formattedResults.length,
            totalResults: searchResults.results.length
          }, null, 2);
        }
        
        return JSON.stringify({
          entity: entityRef,
          documentPath: documentPath ?? 'root',
          query: query,
          results: [],
          resultCount: 0,
          message: 'No relevant content found in the current document context.'
        }, null, 2);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return JSON.stringify({
          error: `Failed to search current document: ${errorMessage}`,
          entity: entityRef,
          query: query
        }, null, 2);
      }
    },
  });
}

/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

interface TechDocsContext {
  isOnTechDocsPage: boolean;
  entityRef?: string;
  documentPath?: string;
}

export const useTechDocsContext = (): TechDocsContext => {
  const location = useLocation();

  const context = useMemo(() => {
    const pathname = location.pathname;
    
    // Check if we're on a TechDocs page (usually /docs/namespace/kind/name/documentPath)
    const techDocsRegex = /^\/docs\/([^/]+)\/([^/]+)\/([^/]+)(?:\/(.*))?/;
    const match = techDocsRegex.exec(pathname);

    if (!match) {
      return {
        isOnTechDocsPage: false,
      };
    }

    const [, namespace, kind, name, documentPath] = match;
    
    // Construct the entity reference in the format "kind:namespace/name"
    const entityRef = `${kind}:${namespace}/${name}`;
    
    return {
      isOnTechDocsPage: true,
      entityRef,
      documentPath: documentPath || 'index',
    };
  }, [location.pathname]);

  return context;
};

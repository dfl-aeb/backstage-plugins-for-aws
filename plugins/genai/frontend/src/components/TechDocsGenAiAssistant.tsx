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

import React from 'react';
import { DocsFloatingChatButton } from './DocsFloatingChatButton';
import { useTechDocsContext } from '../hooks';
import { makeStyles, Box, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  debugInfo: {
    position: 'fixed',
    top: theme.spacing(2),
    left: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    fontSize: '0.75rem',
    zIndex: 999,
    maxWidth: '300px',
  },
}));

export const TechDocsGenAiAssistant = () => {
  const classes = useStyles();
  const { isOnTechDocsPage, entityRef, documentPath } = useTechDocsContext();

  return (
    <>
      {/* Debug info - Remove this in production */}
      <Box className={classes.debugInfo}>
        <Typography variant="caption" component="div">
          <strong>TechDocs Assistant Debug:</strong>
        </Typography>
        <Typography variant="caption" component="div">
          isOnTechDocsPage: {String(isOnTechDocsPage)}
        </Typography>
        <Typography variant="caption" component="div">
          entityRef: {entityRef ?? 'null'}
        </Typography>
        <Typography variant="caption" component="div">
          documentPath: {documentPath ?? 'null'}
        </Typography>
        <Typography variant="caption" component="div">
          URL: {typeof window !== 'undefined' ? window.location.pathname : 'SSR'}
        </Typography>
      </Box>

      {/* Only render on TechDocs pages */}
      {isOnTechDocsPage && (
        <DocsFloatingChatButton
          documentContext={{
            entityRef,
            documentPath,
          }}
        />
      )}
    </>
  );
};

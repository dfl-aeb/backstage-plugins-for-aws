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

import React, { useState } from 'react';
import { makeStyles, Fab, Tooltip } from '@material-ui/core';
import { ChatIcon } from '@backstage/core-components';
import { DocsChatModal } from './DocsChatModal';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    zIndex: 1000,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

interface DocumentContext {
  entityRef?: string;
  documentPath?: string;
}

export interface DocsFloatingChatButtonProps {
  documentContext?: DocumentContext;
}

export const DocsFloatingChatButton = ({ 
  documentContext 
}: DocsFloatingChatButtonProps) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Tooltip title="Ask questions about this document" placement="left">
        <Fab
          className={classes.fab}
          color="primary"
          aria-label="docs chat"
          onClick={handleOpenModal}
        >
          <ChatIcon />
        </Fab>
      </Tooltip>
      
      <DocsChatModal
        open={modalOpen}
        onClose={handleCloseModal}
        documentContext={documentContext}
      />
    </>
  );
};

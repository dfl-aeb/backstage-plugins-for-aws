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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  makeStyles,
  Typography,
  Box,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { ChatHistoryComponent } from '../ChatHistoryComponent';
import { ChatInputComponent } from '../ChatInputComponent';
import { useChatSession } from '../../hooks';

const useStyles = makeStyles(theme => ({
  dialog: {
    '& .MuiDialog-paper': {
      width: '600px',
      height: '70vh',
      maxWidth: '90vw',
      maxHeight: '90vh',
    },
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.spacing(1),
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: 0,
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
  },
  chatHistory: {
    flexGrow: 1,
    minHeight: 0,
    marginBottom: theme.spacing(2),
  },
  contextInfo: {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
  },
}));

interface DocumentContext {
  entityRef?: string;
  documentPath?: string;
}

export interface DocsChatModalProps {
  open: boolean;
  onClose: () => void;
  documentContext?: DocumentContext;
}

export const DocsChatModal = ({
  open,
  onClose,
  documentContext,
}: DocsChatModalProps) => {
  const classes = useStyles();

  // Use docs-assistant agent for document-specific questions
  const { messages, isLoading, onUserMessage, onClear } = useChatSession({
    agentName: 'docs-assistant',
  });

  const handleUserMessage = async (message: string) => {
    // Add document context to the message if available
    let contextualMessage = message;
    if (documentContext?.entityRef) {
      contextualMessage = `Context: I'm currently viewing documentation for entity "${documentContext.entityRef}"${
        documentContext.documentPath ? ` at path "${documentContext.documentPath}"` : ''
      }.\n\nQuestion: ${message}`;
    }
    
    await onUserMessage(contextualMessage);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={classes.dialog}
      aria-labelledby="docs-chat-dialog-title"
    >
      <DialogTitle id="docs-chat-dialog-title" className={classes.dialogTitle}>
        <Typography variant="h6">Documentation Assistant</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent className={classes.dialogContent}>
        <div className={classes.chatContainer}>
          {documentContext?.entityRef && (
            <Box className={classes.contextInfo}>
              <Typography variant="body2" color="textSecondary">
                Asking about: <strong>{documentContext.entityRef}</strong>
                {documentContext.documentPath && (
                  <span> - {documentContext.documentPath}</span>
                )}
              </Typography>
            </Box>
          )}
          
          <ChatHistoryComponent
            messages={messages}
            className={classes.chatHistory}
            isStreaming={isLoading}
            showInformation={false}
          />
          
          <ChatInputComponent
            onMessage={handleUserMessage}
            disabled={isLoading}
            onClear={onClear}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

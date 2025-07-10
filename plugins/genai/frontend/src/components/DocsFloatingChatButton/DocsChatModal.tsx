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
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { ChatHistoryComponent } from '../ChatHistoryComponent';
import { ChatInputComponent } from '../ChatInputComponent';
import { useChatSession } from '../../hooks';

const useStyles = makeStyles(theme => ({
  dialog: {
    '& .MuiDialog-paper': {
      width: '80vw',
      height: '80vh',
      maxWidth: '1200px',
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
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  openInNewButton: {
    marginLeft: theme.spacing(1),
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

  // Prepare hidden context for the LLM
  let hiddenContext: string | undefined;
  if (documentContext?.entityRef) {
    const pathContext = documentContext.documentPath
      ? ` at path "${documentContext.documentPath}"`
      : '';
    hiddenContext = `Current context: I'm viewing documentation for "${documentContext.entityRef}"${pathContext}.`;
  }

  // Use docs-assistant agent for document-specific questions
  const { messages, isLoading, onUserMessage, onClear } = useChatSession({
    agentName: 'docs-assistant',
    hiddenContext,
  });

  const handleUserMessage = async (message: string) => {
    // Message is passed directly - hidden context is handled by useChatSession
    await onUserMessage(message);
  };

  const handleOpenInNewTab = () => {
    window.open('/assistant/docs-assistant', '_blank');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={classes.dialog}
      aria-labelledby="docs-chat-dialog-title"
    >
      <DialogTitle id="docs-chat-dialog-title" className={classes.dialogTitle}>
        <div className={classes.titleContainer}>
          <Typography variant="h6">Documentation Assistant</Typography>
          <div>
            <IconButton
              onClick={handleOpenInNewTab}
              size="small"
              className={classes.openInNewButton}
              title="Open in new tab"
            >
              <OpenInNewIcon />
            </IconButton>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <div className={classes.chatContainer}>
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

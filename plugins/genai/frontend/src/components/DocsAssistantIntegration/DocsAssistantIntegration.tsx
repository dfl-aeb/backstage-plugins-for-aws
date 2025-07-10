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
import { makeStyles, IconButton, Tooltip, Chip } from '@material-ui/core';
import { ChatIcon } from '@backstage/core-components';
import { DocsChatModal } from '../DocsFloatingChatButton/DocsChatModal';
import { useTechDocsContext } from '../../hooks';

const useStyles = makeStyles(theme => ({
  // Option 1: Sticky Mini-Sidebar (Right edge)
  stickyAssistant: {
    position: 'fixed',
    right: theme.spacing(1),
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1200,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '50% 0 0 50%',
    padding: theme.spacing(1),
    boxShadow: theme.shadows[6],
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },

  // Option 2: Content-integrated Toolbar (Top of page)
  contentToolbar: {
    position: 'fixed',
    top: theme.spacing(10), // Under the main header
    right: theme.spacing(2),
    zIndex: 1200,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.grey[300]}`,
    boxShadow: theme.shadows[2],
  },

  // Option 3: Minimal Chip Style
  assistantChip: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    zIndex: 1200,
  },

  // Option 4: Top Documentation Bar
  topDocBar: {
    position: 'fixed',
    top: theme.spacing(8), // Under backstage header
    left: 0,
    right: 0,
    zIndex: 1100,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: theme.spacing(0.5, 2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: '0.875rem',
  },
  topDocBarText: {
    marginRight: theme.spacing(1),
    opacity: 0.9,
  },
}));

interface DocsAssistantIntegrationProps {
  variant?: 'sticky' | 'toolbar' | 'chip' | 'topbar';
}

export const DocsAssistantIntegration = ({
  variant = 'sticky',
}: DocsAssistantIntegrationProps) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const { isOnTechDocsPage, entityRef, documentPath } = useTechDocsContext();

  if (!isOnTechDocsPage) return null;

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const documentContext = { entityRef, documentPath };

  // Sticky Mini-Sidebar (Right edge)
  if (variant === 'sticky') {
    return (
      <>
        <Tooltip title="Documentation Assistant" placement="left">
          <IconButton
            className={classes.stickyAssistant}
            onClick={handleOpen}
            size="small"
          >
            <ChatIcon />
          </IconButton>
        </Tooltip>

        <DocsChatModal
          open={modalOpen}
          onClose={handleClose}
          documentContext={documentContext}
        />
      </>
    );
  }

  // Content-integrated Toolbar (Fixed top-right)
  if (variant === 'toolbar') {
    return (
      <>
        <div className={classes.contentToolbar}>
          <Tooltip title="Ask questions about this documentation">
            <IconButton onClick={handleOpen} size="small">
              <ChatIcon />
            </IconButton>
          </Tooltip>
        </div>

        <DocsChatModal
          open={modalOpen}
          onClose={handleClose}
          documentContext={documentContext}
        />
      </>
    );
  }

  // Top Documentation Bar
  if (variant === 'topbar') {
    return (
      <>
        <div className={classes.topDocBar}>
          <span className={classes.topDocBarText}>
            Documentation Assistant available
          </span>
          <IconButton onClick={handleOpen} size="small" color="inherit">
            <ChatIcon />
          </IconButton>
        </div>

        <DocsChatModal
          open={modalOpen}
          onClose={handleClose}
          documentContext={documentContext}
        />
      </>
    );
  }

  // Minimal Chip Style
  return (
    <>
      <Chip
        className={classes.assistantChip}
        icon={<ChatIcon />}
        label="Ask AI"
        onClick={handleOpen}
        clickable
        color="primary"
      />

      <DocsChatModal
        open={modalOpen}
        onClose={handleClose}
        documentContext={documentContext}
      />
    </>
  );
};

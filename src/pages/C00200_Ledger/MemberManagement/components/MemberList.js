import React from 'react';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import { useTheme } from 'styled-components';

export default ({ title = '標題', list = [] }) => {
  const theme = useTheme();
  return (
    <Box
      bgcolor={theme.colors.background.lightest}
      mb={1}
      borderRadius="20px 20px 0px 0px"
    >
      <List disablePadding>
        <Box
          bgcolor={theme.colors.card.purple}
          borderRadius="20px 20px 0px 0px"
        >
          <ListItem>{`${title} (${list.length})`}</ListItem>
          <Divider />
        </Box>
        {list.map((item) => (
          <Box key={item.label}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              {item.label}
              <ListItemSecondaryAction>
                <Box
                  display={item.showDeleteIcon ? 'block' : 'none'}
                  onClick={item.callback}
                >
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </Box>
        ))}
      </List>
    </Box>
  );
};

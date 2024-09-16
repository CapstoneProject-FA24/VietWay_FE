import React from 'react';
import { Collapse, List, ListItem, ListItemText, ListItemButton, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const commonQuestions = [
  {
    question: "Chuyển hoặc hủy tour như thế nào?",
    answer: "Quý khách có thể chuyển hoặc hủy tour bằng cách liên hệ với chúng tôi qua số điện thoại hoặc email được cung cấp trên trang web."
  },
  {
    question: "Tôi có thể đổi ngày đi không?",
    answer: "Quý khách có thể đổi ngày đi bằng cách liên hệ với chúng tôi ít nhất 7 ngày trước ngày khởi hành dự kiến."
  },
  {
    question: "Có dịch vụ đưa đón tới và đi từ sân bay không?",
    answer: "Chúng tôi cung cấp dịch vụ đưa đón sân bay cho tất cả các tour. Vui lòng cung cấp thông tin chuyến bay của quý khách khi đặt tour."
  }
];

const CommonQuestions = () => {
  const [open, setOpen] = React.useState(null);

  const handleClick = (index) => {
    setOpen(open === index ? null : index);
  };

  return (
    <List>
      {commonQuestions.map((item, index) => (
        <div key={index} style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
          <ListItemButton onClick={() => handleClick(index)} >
            <ListItemText primary={item.question} primaryTypographyProps={{ fontSize: '1.2rem', fontWeight: '500' }}/>
            <IconButton>
              {open === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </ListItemButton>
          <Collapse in={open === index} timeout="auto" unmountOnExit  sx={{ mt: -2 }}>
            <List component="div" disablePadding>
              <ListItem>
                <ListItemText primary={item.answer} />
              </ListItem>
            </List>
          </Collapse>
        </div>
      ))}
    </List>
  );
};

export default CommonQuestions;

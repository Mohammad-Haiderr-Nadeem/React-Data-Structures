import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid none',
    boxShadow: 24,
    p: 4,
  };

export default function ModalForm(props) {

  const handleOnChangeComment  = (e) => {
    handleSetComment(e.target.value);
  }

  const handleOnChangeColor = (e) => {
    handleSetColor(e.target.value);
  }

  const handleSetColor = (data) => {
    props.setColor(data);
  }

  const handleSetComment = (data) => {
    props.setComment(data);
  }

  const handleOnClickOk = () => {
    console.log('props.selectedRowIndex', props.selectedRowIndex);
    console.log('props.comment', props.comment);
    console.log('props.color', props.color);
    const data = {
      id: props.selectedRowIndex,
      com: props.comment,
      col: props.color,
    };
    props.setRowData(data);
    props.handleSave(data);
  };

  return (
    <main>
      {}
      <Modal
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <h3 style={{fontFamily:'Times New Roman'}}>Additional Info</h3>
            <label style={{fontSize:'15px'}}>Comment:
              <input
                  name="comment"
                  type="text"
                  placeholder="please write your text..."
                  onChange={handleOnChangeComment}
                  value={props.comment}
                  required
                  style={{width:'88%',padding:'5px',marginLeft:'5px'}}
              />
            </label>
            <br />
            <br />
            <label style={{fontSize:'15px', marginLeft:'25px'}}>Select:
              <select
                name="select"
                onChange={handleOnChangeColor}
                value={props.color}
                required
                style={{width:'89%',padding:'5px',marginLeft:'5px'}}
              >
                <option>....</option>
                <option>Red</option>
                <option>Blue</option>
                <option>White</option>
              </select>
            </label>     
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <button style={{marginLeft:'80%', backgroundColor:'white',color:'black',border:'1px solid black',padding:'5px', marginRight:'5px'}} 
            onClick={() => props.setOpen(false)}>
              Cancel
            </button>
            <button style={{backgroundColor:'rgb(54, 128, 247)',width:'60px',color:'white',border:'1px solid black',padding:'5px'}} 
            onClick={handleOnClickOk}>
            OK
            </button>
          </Typography>
        </Box>
      </Modal>
    </main>
  );
}



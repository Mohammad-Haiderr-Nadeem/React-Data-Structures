import React from "react";
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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

export default function RoadDetails(props) {
  
    return (
      <main>
        <Modal
          open={props.openView}
          onClose={() => props.setOpenView(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2"> 
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={props.rows}
                        columns={props.columns}
                        pageSize={10}
                        getRowHeight={() => 'auto'} 
                        rowsPerPageOptions={[25, 50, 100]} 
                    />  
                </div>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Button variant="secondary" onClick={() => props.setOpenView(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => props.setOpenView(false)}>
                OK
              </Button>
            </Typography>
          </Box>
        </Modal>
      </main>
    );
}
  


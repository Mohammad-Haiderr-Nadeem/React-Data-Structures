import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import Button from "../Button/Button";
import styles from './Road.module.css'
import ModalForm from "../ModalForm/ModalForm";
import RoadDetails from "../RoadDetails/RoadDetails";

export default function Road() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [details, setDetails] = useState([]);
    const [viewClicked, setViewClicked] = useState(false);
    const [comment, setComment] = useState('');
    const [color, setColor] = useState('');
    const [rowData, setRowData] = useState([]);
    const [paramsData, setParamsData] = useState();
   
    useEffect(() => {
        fetchRows();
    }, [details, rowData]);

    const fetchRows = async () => {
        try {
            const res = await axios.get('https://verkehr.autobahn.de/o/autobahn/');
            const roads = res.data.roads.map((road, index) => ({
                id: index + 1, 
                col1: road, 
            }));
            setRows(roads);
        } catch (err) {
            console.log('error in fetching apiData', err);
        }
    };

    const handleView = async (params) => {
        setOpenView(true);
        try{
            const res = await axios.get(`https://verkehr.autobahn.de/o/autobahn/${params.row.col1}/services/roadworks`);
            setViewClicked(true);
            const { roadworks } = res.data; 
            const formattedRoadworks = roadworks.map((roadwork, index) => ({
                id: index + 1,
                col1: roadwork.title,
                col2: roadwork.subtitle,
                col3: roadwork.description, 
                col4: roadwork.coordinate.lat + ' ' + roadwork.coordinate.long,
            }));
            handleSetDetails(formattedRoadworks);
        } catch(err){
            console.log('error in fetching apiData', err);
        }    
    };

    const handleSetDetails = (formattedRoadworks) => {
        setDetails(formattedRoadworks);
    };

    const handleAction = (params) => {
        const id = params.row.col1;
        const data = {id, comment: '', color: ''};
        setRowData([...rowData, data]);
    };  

    const ViewButton = (params) => {
        return (
            <Button name={'view'} handleOnClick={() => handleView(params)} />
        );
    };

    const ActionButton = (params) => {
        const id =  params.row.col1;
        const isFavorite = rowData.find((data) => data.id === id)
       
        const handleEditClick = () => {
            setParamsData(params.row.col1);
            const editData = rowData.find((data) => data.id === params.row.col1);
            if(editData.comment !== '' || editData.color !== ''){
                setComment(editData.comment);
                setColor(editData.color);
            }else {
                setComment('');
                setColor('');
            }
            setOpen(true);
        };

        const handleRemoveClick = () => {
            setParamsData(params.row.col1);
            const updatedArray = rowData.filter((row) => {
                return row.id !== params.row.col1
            });
            setRowData(updatedArray);
        }; 
        if (isFavorite) {
          return (
            <div className={styles.displayButtons}>
              <Button name={'Remove'} handleOnClick={handleRemoveClick} />
              <Button name={'Edit'} handleOnClick={handleEditClick} />
            </div>
          );
        } else {
          return (
            <Button name={'Add to favorite'} handleOnClick={() => handleAction(params)} />
          );
        }
    };
    
    const handleSave = (val) => {
        const updatedArray = rowData.map((row) => {
            if(row.id === val.id){
                return val;
            }
            return row;
        });
        setRowData(updatedArray);
        setOpen(false);
    };
    
    const columns = [
        { field: 'col1', headerName: 'Road name', width: 500 },
        { field: 'col2', headerName: 'Road Works', width: 500, renderCell: ViewButton },
        { field: 'col3', headerName: 'Action', width: 500, renderCell: ActionButton },
    ];

    const innerColumns = [
        { field: 'col1', headerName: 'Title', width: 200 },
        { field: 'col2', headerName: 'SubTitle', width: 200},
        { field: 'col3', headerName: 'Description', width: 200 },
        { field: 'col4', headerName: 'Coordinate', width: 200 },
    ];

    return (
        <main>
            <ModalForm
                open={open}
                setOpen={setOpen}
                paramsData={paramsData}
                handleSave={handleSave}
                rowData={rowData[selectedRowIndex]}
                comment={comment}
                setComment={setComment}
                setColor={setColor}
                color={color}
                setRowData={setRowData}
            />
            {viewClicked && (
                <RoadDetails
                openView={openView}
                setOpenView={setOpenView}
                rows={details}
                columns={innerColumns}
                />
            )}
            <div style={{ height: 800, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[25, 50, 100]} 
                    onRowClick={(params) => setSelectedRowIndex(params.row.id)}
                    selectionModel={selectedRowIndex !== null ? [selectedRowIndex] : []}
                />
            </div>
        </main>
    );
}

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
    const [favoriteRows, setFavoriteRows] = useState(new Set());
    const [viewClicked, setViewClicked] = useState(false);
    const [comment, setComment] = useState();
    const [color, setColor] = useState('');
    const [rowData, setRowData] = useState({});

    // useEffect(() => {
    //     if (selectedRowIndex !== rowData.id) {
    //     setRowData({
    //         id: selectedRowIndex,
    //         com: "",
    //         col: "",
    //     });
    //     }
    // }, [selectedRowIndex,rowData.id]);

    useEffect(() => {
        if (selectedRowIndex !== null) {
            console.log('details', details);
        const rowData = details.find(row => row?.id === selectedRowIndex);
        if (rowData) {
            setComment(rowData.com || "");
            setColor(rowData.col || "");
        } 
        }
    }, [selectedRowIndex, details]);

    
    useEffect(() => {
        fetchRows();
    }, [details]);

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
    }

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
    }

    const handleSetDetails = (formattedRoadworks) => {
        setDetails(formattedRoadworks);
    }

    const handleAction = (params) => {
        const rowId = params.row.id;
        setColor('');
        setComment('');
        if (favoriteRows.has(rowId)) {
          favoriteRows.delete(rowId);
        } else {
          favoriteRows.add(rowId);
        }
        setFavoriteRows(new Set(favoriteRows));
    };  

    const handleEdit = () => {
        setOpen(true);
    };

    const ViewButton = (params) => {
        return (
            <Button name={'view'} handleOnClick={() => handleView(params)} />
        );
    };

    const ActionButton = (params) => {
        const rowId = params.row.id;
        if(favoriteRows.has(rowId)){
          return(
            <div className={styles.displayButtons}>
              <Button name={'Remove'} handleOnClick={() => handleAction(params)}/>
              <Button name={'Edit'} handleOnClick={handleEdit} />
            </div>
          );
        } else{
          return(
            <Button name={'Add to favorite'} handleOnClick={() => handleAction(params)} />
          );
        }
    };
  
    const handleSave = (data) => {
        const updatedRows = [...details];
        const rowIndex = selectedRowIndex - 1;
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...data };
        setDetails(updatedRows);
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
            rows={details}
            selectedRowIndex={selectedRowIndex}
            handleSave={handleSave}
            comment={comment}
            setComment={setComment}
            setColor={setColor}
            color={color}
            rowData={rowData}
            setRowData={setRowData}
            setDetails={setDetails}
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

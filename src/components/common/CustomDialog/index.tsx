import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

const CustomDialog = (props: any) => {

    const {visible, onClose, dialogInfo} = props;
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        if (!onClose || typeof onClose !== "function") {
            console.log('[CustomDialog] callback not found!');
            return;
        }
        console.log('[CustomDialog] dialog is closing!');
        onClose(!open);
    }

    useEffect(() => {
        if (visible !== open) {
            setOpen(visible);
        }
    }, [visible, open]);

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{dialogInfo.title}</DialogTitle>
                <DialogContent>
                    {
                        dialogInfo.description && <DialogContentText>{dialogInfo.description}</DialogContentText>
                    }
                    {dialogInfo.children}
                </DialogContent>
                <DialogActions>
                    {
                        dialogInfo.buttons.length > 0 && dialogInfo.buttons.map((button: any, index: number) =>
                            <Button key={`btn-num-${index+1}`} onClick={button.onClick}>{button.label}</Button>
                        )
                    }
                    {/*<Button onClick={handleClose}>Cancel</Button>*/}
                    {/*<Button onClick={handleClose}>Subscribe</Button>*/}
                </DialogActions>
            </Dialog></>
    );
}

CustomDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    dialogInfo: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        children: PropTypes.any,
        buttons: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                onClick: PropTypes.func
            })
        )
    }).isRequired,
    message: PropTypes.string
};

CustomDialog.defaultProps = {
    visible: false,
    onClose: null,
    dialogInfo: {
        title: 'Default title',
        buttons: [],
        children: null
    }
}

export default CustomDialog;
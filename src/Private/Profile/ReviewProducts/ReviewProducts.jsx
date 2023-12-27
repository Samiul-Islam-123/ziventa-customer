import { Card, CardActionArea, Dialog, DialogTitle, DialogContent, TextField, DialogContentText, CardContent } from '@mui/material'
import React, { useState } from 'react'

function ReviewProducts() {

    const [openDialog, setopenDialog] = useState(false);

    return (
        <>
            <Card>
                <CardActionArea onClick={() => {
                    setopenDialog(true);
                }}>
                    <CardContent>

                        This is a Card
                    </CardContent>
                </CardActionArea>
            </Card>

            <Dialog open={openDialog} onClose={() => {
                setopenDialog(false);
            }}>
                <DialogTitle>
                    Review Product
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Write a review about your product
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Write review here"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ReviewProducts
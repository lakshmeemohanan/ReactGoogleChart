import React, {useRef, useState, useEffect} from "react";
import './ImageUpload.css';
import Button from "./Button";

const ImageUpload = props => {
    const filePickerRef = useRef();
    const [file, setFile] = useState();
    const [previewURL, setPreviewURL] = useState();
    const [isValid, setIsValid] = useState();

    /* To generate a preview of the image picked  starts */
    useEffect(() => {
        if(!file){
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () =>{
            setPreviewURL(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);
    /* To generate a preview of the image picked  ends */

    /* To show the list of files to be selected to upload starts */
    const pickImageHandler = () => {
        filePickerRef.current.click();
    };
    /* To show the list of files to be selected to upload ends */

    /* Process done when a file is selected to upload starts */
    const pickedHandler = event => {
        let pickedFile;
        let fileIsValid = isValid;
        if(event.target.files && event.target.files.length === 1){
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        }else{
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    };
    /* Process done when a file is selected to upload ends */
    return (
        <div className="form-input">
            <input id={props.id} style={{display:'none'}} ref={filePickerRef} 
            type="file" accept=".jpeg,.jpg,.png" onChange={pickedHandler} />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    {previewURL && <img src={previewURL} alt="Preview" />}
                    {!previewURL && <p>Please pick an image.</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};
export default ImageUpload;
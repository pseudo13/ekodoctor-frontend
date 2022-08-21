import React, { useState } from "react";

export const SickcaseEditable = ({ sickcase, submit }) => {
  const [editableSickcase, setEditableSickcase] = useState(sickcase);
  const [selectedImage, setSelectedImage] = useState(sickcase.image);
  const handleInputChange = ({ target }) => {
    const { value, name } = target;
    setEditableSickcase({
      ...editableSickcase,
      [name]: value,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted!");
    const formData = new FormData(event.target);

    if (selectedImage !== null) {
      formData.append("image", selectedImage);
    }
    submit(formData, editableSickcase);
  };

  const selectImage = (image) => setSelectedImage(image);

  const unselectImage = () => setSelectedImage(null);

  const onImageChange = (e) => {
    const [file] = e.target.files;
    setSelectedImage(file);
  };

  return (
    <>
      <div className="card-image card-padding">
        {/* <ImageUploader
          image={editableSickcase.image}
          selectImage={selectImage}
          unselectImage={unselectImage}
        /> */}
        <p className="title is-4">
          Upload recording of your heart beats to make an check by doctor !
        </p>
        <input type="file" onChange={onImageChange} />
        <img src={selectedImage} alt="" />
        {selectedImage && (
          <label>
            Current file: {selectedImage ? selectedImage.name : "None"}
          </label>
        )}
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <label htmlFor="title" className="label">
            Title
          </label>
          <div className="control">
            <input
              id="title"
              name="title"
              className="input"
              type="text"
              value={editableSickcase.title}
              onChange={handleInputChange}
            />
          </div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <div className="control">
            <textarea
              id="description"
              name="description"
              className="textarea"
              value={editableSickcase.description}
              onChange={handleInputChange}
            />
          </div>
          <label htmlFor="instruction" className="label">
            Instruction
          </label>
          <div className="control">
            <textarea
              id="instruction"
              name="instruction"
              className="textarea"
              value={editableSickcase.instruction}
              onChange={handleInputChange}
            />
          </div>
          <div className="control has-text-left editable-buttons">
            <input type="submit" value="Submit" className="button is-danger" />
          </div>
        </form>
      </div>
    </>
  );
};

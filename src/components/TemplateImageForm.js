import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FieldFileInput from "./FieldFileInput";
// import { bindActionCreators } from "redux";
// import { uploadTemplateImage } from "../actions";

class TemplateImageForm extends Component {
  state = {
    loading: false,
    thumb: undefined
  };

  componentWillMount() {
    const { imageKey, imageType, value } = this.props;
    this.setState({
      imageKey: imageKey,
      imageType: imageType,
      thumb: value
    });
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.value !== nextProps.value) {
      this.setState({
        thumb: nextProps.value
      });
    }
  };

  onChangeHanlder = imageData => {
    let reader = new FileReader();
    // const uploadImageFormData = new FormData();

    reader.onloadend = () => {
      this.setState({ loading: false, thumb: reader.result });
      const imgBase64 = reader.result.replace(/^data:.*;base64,/, "");

      const payload = {
        imageKey: this.state.imageKey,
        imageType: this.state.imageType,
        imageFile: imgBase64
      };

      this.props.handleUploadImage(payload);
    };
    reader.readAsDataURL(imageData);

    // uploadImageFormData.append("imageFile", imageData);
    // uploadImageFormData.append("imageKey", this.state.imageKey);
    // uploadImageFormData.append("imageType", this.state.imageType);

    // this.props.handleUploadImage(uploadImageFormData);
  };

  render() {
    return (
      <div>
        {this.state.thumb && (
          <img src={this.state.thumb} height={180} width={300} />
        )}
        <FieldFileInput onChange={this.onChangeHanlder} />
      </div>
    );
  }
}

TemplateImageForm.propTypes = {
  subTemplateId: PropTypes.number,
  uploadTemplateImage: PropTypes.func,
  handleUploadImage: PropTypes.func,
  imageKey: PropTypes.string,
  imageType: PropTypes.string,
  value: PropTypes.string
};

function mapDispatchToProps(dispatch) {
  console.log(dispatch);
  return {
    // uploadTemplateImage: bindActionCreators(uploadTemplateImage, dispatch)
  };
}

const mapStateToProps = () => {
  return {
    // fieldData: state.templateReducer.dataTemplateFields
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateImageForm);

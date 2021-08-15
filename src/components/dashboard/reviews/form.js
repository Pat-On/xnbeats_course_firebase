import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import Uploader from "./uploader";

import { Form, Button, Col } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import {
  addReview,
  clearReview,
  getReviewById,
  editReview,
} from "../../../store/actions";

class ReviewForm extends Component {
  state = {
    editor: "",
    editorError: false,
    img: "https://via.placeholder.com/400",
    imgName: "",
    imgError: "",
    disable: false,
    initialValues: {
      title: "",
      excerpt: "",
      rating: "",
      public: "",
    },
  };

  componentDidMount() {
    const id = this.props.id;

    if (id) {
      this.props
        .dispatch(getReviewById(id))
        .then(() => {
          const reviewById = this.props.reviews.reviewById;
          this.setState({
            mode: "edit",
            editor: reviewById.content,
            img: reviewById.downloadUrl,
            imgName: reviewById.img,
            initialValues: {
              title: reviewById.title,
              excerpt: reviewById.excerpt,
              rating: reviewById.rating,
              public: reviewById.public,
            },
          });
        })
        .catch((e) => {
          this.props.history.push("/dashboard/reviews");
          toast.error("Sorry, the post does not exists", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        });
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearReview());
  }

  handleResetForm = (resetForm) => {
    resetForm({});
    this.setState({
      editor: "",
      img: "https://via.placeholder.com/400",
      imgError: false,
      disable: false,
    });
    toast.success("Congrats you post has been uploaded", {
      position: toast.POSITION.TOP_LEFT,
    });
  };

  handleImageName = (name, download) => {
    this.setState({ img: download, imgName: name });
  };

  handleSubmit = (values, resetForm) => {
    let formData = {
      ...values,
      content: this.state.editor,
      img: this.state.imgName,
    };

    if (this.state.mode === "add") {
      this.props
        .dispatch(addReview(formData, this.props.auth.user))
        .then(() => {
          this.handleResetForm(resetForm);
        });
    } else {
      this.props.dispatch(editReview(formData, this.props.id)).then(() => {
        this.setState({ disable: false });
        toast.success("Congrats you post has been updated", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
    }
  };

  render() {
    const state = this.state; // ref

    return (
      <Formik
        enableReinitialize
        initialValues={state.initialValues}
        validationSchema={Yup.object({
          title: Yup.string().required("The title is required"),
          excerpt: Yup.string().required("You must add an excerpt"),
          rating: Yup.number().required("The rating too"),
          public: Yup.number().required("is it public or a draft ?"),
        })}
        onSubmit={(values, { resetForm }) => {
          if (Object.entries(state.editor).length === 0) {
            return this.setState({ editorError: true });
          } else if (state.imgName === "") {
            return this.setState({ imgError: true, editorError: false });
          } else {
            this.setState({ disable: true, editorError: false });
            this.handleSubmit(values, resetForm);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Row>
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                  />
                  {errors.title && touched.title ? (
                    <div className="error">{errors.title}</div>
                  ) : null}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Excerpt</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="3"
                    name="excerpt"
                    value={values.excerpt}
                    onChange={handleChange}
                  />
                  {errors.excerpt && touched.excerpt ? (
                    <div className="error">{errors.excerpt}</div>
                  ) : null}
                </Form.Group>
                <Form.Group>
                  <CKEditor
                    editor={ClassicEditor}
                    data={state.editor}
                    onChange={(event, editor) => {
                      this.setState({
                        editor: editor.getData(),
                      });
                    }}
                  />
                </Form.Group>
                {state.editorError ? (
                  <div className="error">Sorry, wee need something here</div>
                ) : null}

                <Form.Group>
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    as="select"
                    name="rating"
                    value={values.rating}
                    onChange={handleChange}
                  >
                    <option value="" defaultValue>
                      Choose...
                    </option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </Form.Control>
                  {errors.rating && touched.rating ? (
                    <div className="error">{errors.rating}</div>
                  ) : null}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Public</Form.Label>
                  <Form.Control
                    as="select"
                    name="public"
                    value={values.public}
                    onChange={handleChange}
                  >
                    <option value="" defaultValue>
                      Choose...
                    </option>
                    <option value="1">Public</option>
                    <option value="0">Draft</option>
                  </Form.Control>
                  {errors.public && touched.public ? (
                    <div className="error">{errors.public}</div>
                  ) : null}
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={state.disable}
                >
                  Submit
                </Button>
              </Col>
              <Col>
                <Uploader
                  handleImageName={this.handleImageName}
                  img={this.state.img}
                />
                {state.imgError ? (
                  <div className="error">Add an image please</div>
                ) : null}
              </Col>
            </Form.Row>
          </Form>
        )}
      </Formik>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    reviews: state.reviews,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(ReviewForm);

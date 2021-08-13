import React, { useState } from "react";
import DashLayout from "../../../utils/dash_layout";
import { useForm } from "react-hook-form";
import LoginModal from "../../../utils/login_modal";
import { toast } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../../../store/actions/index";

const Profile = (props) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { register, handleSubmit, errors } = useForm();
  const [disabled, setDisabled] = useState(false);
  const [showModal, setShowModal] = useState({
    open: false,
    formData: "",
  });

  const handleReAuthModal = (data) => {
    setShowModal({ open: true, formData: data });
  };

  const submitForm = (data) => {
    const isEmailChanged = auth.user.email === data.email ? false : true;
    setDisabled(true);
    setShowModal({ open: false, formData: "" });

    // dispatch
    dispatch(
      updateProfile({ uid: auth.user.uid, ...data }, isEmailChanged)
    ).then(() => {
      toast.success("Congrats your profile has been updated", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    });
  };

  const handleClose = () => setShowModal({ open: false, formData: "" });

  return (
    <DashLayout auth={auth} title="Profile">
      <form onSubmit={handleSubmit(handleReAuthModal)}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="name">First name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              defaultValue={auth.user.name}
              // ref={register({required: true})}
              {...register({ required: true })}
            />
            {errors.name && (
              <span className="error">This field is required</span>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="lastname">Last name</label>
            <input
              type="text"
              className="form-control"
              name="lastname"
              defaultValue={auth.user.lastname}
              // ref={register({required: true})}
              {...register({ required: true })}
            />
            {errors.lastname && (
              <span className="error">This field is required</span>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            defaultValue={auth.user.email}
            // ref={register({
            //     required: true,
            //     pattern:  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // eslint-disable-line
            // })}
            {...register({
              required: true,
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // eslint-disable-line
            })}
          />
          {errors.email && (
            <span className="error">Please check your email</span>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            className="form-control"
            name="address"
            defaultValue={auth.user.address}
            // ref={register}
            {...register}
          />
        </div>

        <div className="row">
          <div className="col-md-5 mb-3">
            <label htmlFor="gen">What are you ?</label>
            <select
              className="custom-select d-block w-100"
              name="gen"
              defaultValue={auth.user.gen}
              // ref={register}
              {...register("test", { required: true })}
            >
              <option value="" defaultValue>
                Choose...
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="musician">Musician</option>
              <option value="robot">Robot</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="daw">DAW</label>
            <select
              className="custom-select d-block w-100"
              name="daw"
              defaultValue={auth.user.daw}
              // ref={register}
              {...register}
            >
              <option value="" defaultValue>
                Choose...
              </option>
              <option value="ableton">Ableton</option>
              <option value="bitwig">Bitwig</option>
              <option value="studio one">Studio one</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="age">Age</label>
            <input
              type="text"
              className="form-control"
              name="age"
              defaultValue={auth.user.age}
              // ref={register}
              {...register}
            />
          </div>
        </div>

        <hr className="mb-4" />

        <button
          className="btn btn-outline-primary btn-lg btn-block"
          type="submit"
          disabled={disabled}
        >
          Update profile
        </button>
      </form>
      <LoginModal
        modalState={showModal}
        handleClose={handleClose}
        submitForm={(data) => submitForm(data)}
      />
    </DashLayout>
  );
};

export default Profile;

// //src/components/organisms/CreateRoomForm.js
import React from "react";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";
import RadioInput from "../atoms/RadioInput"; 
import Label from "../atoms/Label"; 

const ValidationError = ({ message }) => {
  if (!message) return null;
  return (
    <div className="text-danger mt-1" style={{ fontSize: "0.875em" }}>
      {message}
    </div>
  );
};

function CreateRoomForm({
  roomName,
  onRoomNameChange,
  userName,
  onUserNameChange,
  onSubmit,
  roomNameError,
  userNameError,
  userRole,
  onUserRoleChange,
}) {
  return (
    <div className="card shadow">
      <div className="card-body">
        <h2 className="card-title text-center">Create a New Room</h2>
        <form onSubmit={onSubmit} noValidate>
          <FormField
            label="Room Name:"
            id="roomName"
            value={roomName}
            onChange={onRoomNameChange}
            required
          />
          <ValidationError message={roomNameError} />

          <FormField
            label="Your Name (Moderator):"
            id="userName"
            value={userName}
            onChange={onUserNameChange}
            required
          />
          <ValidationError message={userNameError} />

          <div className="my-3">
            <Label>Modo de visualización:</Label>
            <div>
              <RadioInput
                id="rolePlayer"
                name="userRole"
                value="PLAYER"
                checked={userRole === "PLAYER"}
                onChange={onUserRoleChange}
                label="Jugador"
              />
              <RadioInput
                id="roleSpectator"
                name="userRole"
                value="SPECTATOR"
                checked={userRole === "SPECTATOR"}
                onChange={onUserRoleChange}
                label="Espectador"
              />
            </div>
          </div>

          <div className="d-grid mt-4">
            <Button type="submit" className="btn-primary">
              Create Room
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRoomForm;

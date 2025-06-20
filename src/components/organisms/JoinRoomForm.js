//src/components/organisms/JoinRoomForm.js
import React from 'react';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import RadioInput from '../atoms/RadioInput'; 
import Label from "../atoms/Label"; 

function JoinRoomForm({ roomName, userName, onUserNameChange, onSubmit, userRole, onUserRoleChange, roleError }) {
  const ValidationError = ({ message }) => 
    message ? <div className="text-danger mt-1" style={{ fontSize: '0.875em' }}>{message}</div> : null;
  
  return (
    <div className="card shadow w-50 mx-auto">
      <div className="card-body">
        <h3 className="card-title text-center">Join Room: {roomName}</h3>
        <form onSubmit={onSubmit} noValidate>
          <FormField 
            label="Your Name:" 
            id="joinName" 
            value={userName} 
            onChange={onUserNameChange} 
            autoFocus 
            required 
          />
          
          <div className="my-3">
            <Label>Modo de visualización:</Label>
            <div>
              <RadioInput
                id="joinRolePlayer"
                name="joinUserRole"
                value="PLAYER"
                checked={userRole === 'PLAYER'}
                onChange={onUserRoleChange}
                label="Jugador"
              />
              <RadioInput
                id="joinRoleSpectator"
                name="joinUserRole"
                value="SPECTATOR"
                checked={userRole === 'SPECTATOR'}
                onChange={onUserRoleChange}
                label="Espectador"
              />
            </div>
            <ValidationError message={roleError} />
          </div>
          
          <div className="d-grid mt-3">
            <Button type="submit" className="btn-primary">Join Room</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JoinRoomForm;
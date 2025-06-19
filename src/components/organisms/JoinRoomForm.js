//src/components/organisms/JoinRoomForm.js
import React from 'react';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';

function JoinRoomForm({ roomName, userName, onUserNameChange, onSubmit, userRole, onUserRoleChange, roleError }) {
  const ValidationError = ({ message }) => {
    if (!message) return null;
    return <div className="text-danger mt-1" style={{ fontSize: '0.875em' }}>{message}</div>;
  };
  
  return (
    <div className="card shadow w-50 mx-auto">
      <div className="card-body">
        <h3 className="card-title text-center">Join Room: {roomName}</h3>
        <form onSubmit={onSubmit} noValidate>
          <FormField label="Your Name:" id="joinName" value={userName} onChange={onUserNameChange} autoFocus required />
          
          <div className="my-3">
            <label className="form-label fw-bold">Modo de visualización:</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="joinUserRole" // Unique name
                  id="joinRolePlayer"   // <-- FIX: Unique ID
                  value="PLAYER"
                  checked={userRole === 'PLAYER'}
                  onChange={onUserRoleChange} // <-- FIX: Ensure onChange is present
                />
                <label className="form-check-label" htmlFor="joinRolePlayer">Jugador</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="joinUserRole" // Unique name
                  id="joinRoleSpectator" // <-- FIX: Unique ID
                  value="SPECTATOR"
                  checked={userRole === 'SPECTATOR'}
                  onChange={onUserRoleChange} // <-- FIX: Ensure onChange is present
                />
                <label className="form-check-label" htmlFor="joinRoleSpectator">Espectador</label>
              </div>
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
// //src/components/organisms/CreateRoomForm.js
// import React from 'react';
// import FormField from '../molecules/FormField';
// import Button from '../atoms/Button';

// function CreateRoomForm({ roomName, onRoomNameChange, userName, onUserNameChange, onSubmit }) {
//   return (
//     <div className="card shadow">
//       <div className="card-body">
//         <h2 className="card-title text-center">Create a New Room</h2>
//         <form onSubmit={onSubmit}>
//           <FormField
//             label="Room Name:"
//             id="roomName"
//             value={roomName}
//             onChange={onRoomNameChange}
//             required
//           />
//           <FormField
//             label="Your Name (Moderator):"
//             id="userName"
//             value={userName}
//             onChange={onUserNameChange}
//             required
//           />
//           <div className="d-grid">
//             <Button type="submit" className="btn-primary">Create Room</Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default CreateRoomForm;


import React from 'react';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';

// A small, local component to render the error message
const ValidationError = ({ message }) => {
  if (!message) return null;
  return (
    <div className="text-danger mt-1" style={{ fontSize: '0.875em' }}>
      {message}
    </div>
  );
};

// We add userRole and onUserRoleChange to the list of props
function CreateRoomForm({
  roomName,
  onRoomNameChange,
  userName,
  onUserNameChange,
  onSubmit,
  roomNameError,
  userNameError,
  userRole, // <-- New prop to receive the current role
  onUserRoleChange, // <-- New prop to handle role changes
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

          {/* --- THIS IS THE SECTION THAT WAS MISSING --- */}
          <div className="my-3">
            <label className="form-label fw-bold">Modo de visualización:</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="userRole"
                  id="rolePlayer"
                  value="PLAYER"
                  checked={userRole === 'PLAYER'}
                  onChange={onUserRoleChange}
                />
                <label className="form-check-label" htmlFor="rolePlayer">Jugador</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="userRole"
                  id="roleSpectator"
                  value="SPECTATOR"
                  checked={userRole === 'SPECTATOR'}
                  onChange={onUserRoleChange}
                />
                <label className="form-check-label" htmlFor="roleSpectator">Espectador</label>
              </div>
            </div>
          </div>
          {/* --- END OF MISSING SECTION --- */}

          <div className="d-grid mt-4">
            <Button type="submit" className="btn-primary">Create Room</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRoomForm;
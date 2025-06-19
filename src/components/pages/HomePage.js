// //src/components/pages/HomePage.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { setRoomState } from '../../store/roomSlice';
// import CreateRoomForm from '../organisms/CreateRoomForm';

// function HomePage() {
//   const [roomName, setRoomName] = useState('DevTEAM');
//   const [userName, setUserName] = useState('ANTONIO');
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleCreateRoom = (e) => {
//     e.preventDefault();
//     if (!roomName.trim() || !userName.trim()) return;

//     const roomId = `room-${Date.now()}`;
//     const creator = { name: userName, isModerator: true, vote: null, hasVoted: false };
//     const initialRoomState = {
//       roomId,
//       roomName,
//       participants: { [userName]: creator },
//       stories: [],
//       activeStoryId: null,
//       votesRevealed: false,
//     };
    
//     dispatch(setRoomState(initialRoomState));
//     navigate(`/room/${roomId}`, { state: { currentUser: creator } });
//   };

//   return (
//     <CreateRoomForm
//       roomName={roomName}
//       onRoomNameChange={(e) => setRoomName(e.target.value)}
//       userName={userName}
//       onUserNameChange={(e) => setUserName(e.target.value)}
//       onSubmit={handleCreateRoom}
//     />
//   );
// }

// export default HomePage;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setRoomState } from '../../store/roomSlice';
import CreateRoomForm from '../organisms/CreateRoomForm';
import { validateName } from '../../utils/validator'; // <-- 1. Import the validator

function HomePage() {
  const [roomName, setRoomName] = useState('DevTEAM1');
  const [userName, setUserName] = useState('ANTONIO1');
  const [userRole, setUserRole] = useState(null); 
  const [roomNameError, setRoomNameError] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [userRoleError, setUserRoleError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreateRoom = (e) => {
    e.preventDefault();

    // Clear previous errors
    setRoomNameError('');
    setUserNameError('');
    setUserRoleError('');

    const roomValidation = validateName(roomName);
    const userValidation = validateName(userName);
    
    let hasErrors = false;
    if (!roomValidation.isValid) {
      setRoomNameError(roomValidation.message);
      hasErrors = true;
    }
    if (!userValidation.isValid) {
      setUserNameError(userValidation.message);
      hasErrors = true;
    }
    
    // --- THIS IS THE UPDATED SECTION ---
    if (!userRole) {
      const message = 'Por favor, seleccione un modo de visualización (Jugador o Espectador).';
      setUserRoleError(message); // This keeps the on-screen error message
      alert(message); // This adds the requested pop-up alert
      hasErrors = true;
    }
    // --- END OF UPDATE ---

    if (hasErrors) {
      return; // Stop submission
    }

    // This code only runs if validation passes
    const roomId = `room-${Date.now()}`;
    const creator = { name: userName, isModerator: true, vote: null, hasVoted: false, role: userRole };
    const initialRoomState = { roomId, roomName, participants: { [userName]: creator }, stories: [], activeStoryId: null, votesRevealed: false };
    
    dispatch(setRoomState(initialRoomState));
    navigate(`/room/${roomId}`, { state: { currentUser: creator } });
  };

  return (
    <CreateRoomForm
      roomName={roomName}
      onRoomNameChange={(e) => setRoomName(e.target.value)}
      userName={userName}
      onUserNameChange={(e) => setUserName(e.target.value)}
      onSubmit={handleCreateRoom}
      roomNameError={roomNameError}
      userNameError={userNameError}
      userRole={userRole}
      onUserRoleChange={(e) => setUserRole(e.target.value)}
      userRoleError={userRoleError}
    />
  );
}

export default HomePage;
// //components/HomePage.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function HomePage() {
//   const [roomName, setRoomName] = useState('DevTEAM');
//   const [userName, setUserName] = useState('ANTONIO');
//   const navigate = useNavigate();

//   const handleCreateRoom = (e) => {
//     e.preventDefault();
//     if (!roomName.trim() || !userName.trim()) {
//       alert('Room Name and User Name are required.');
//       return;
//     }

//     const roomId = `room-${Date.now()}`;
//     const creator = {
//       name: userName,
//       isModerator: true,
//       vote: null,
//       hasVoted: false,
//     };
    
//     const initialRoomState = {
//       roomName: roomName,
//       participants: { [userName]: creator },
//       stories: [],
//       activeStoryId: null,
//       votesRevealed: false,
//     };

//     // --- KEY CHANGE: Use localStorage instead of sessionStorage ---
//     try {
//       localStorage.setItem(roomId, JSON.stringify(initialRoomState));
//     } catch (error) {
//       alert("Failed to create room. Your browser's local storage might be full or disabled.");
//       return;
//     }

//     // Pass the current user's info via location state so the RoomPage knows who "you" are.
//     navigate(`/room/${roomId}`, {
//       state: { currentUser: creator },
//     });
//   };

//   return (
//     <div className="card shadow">
//       <div className="card-body">
//         <h2 className="card-title text-center">Create a New Room</h2>
//         <form onSubmit={handleCreateRoom}>
//           <div className="mb-3">
//             <label htmlFor="roomName" className="form-label">Room Name:</label>
//             <input
//               id="roomName"
//               type="text"
//               className="form-control"
//               value={roomName}
//               onChange={(e) => setRoomName(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="userName" className="form-label">Your Name (Moderator):</label>
//             <input
//               id="userName"
//               type="text"
//               className="form-control"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               required
//             />
//           </div>
//           <div className="d-grid">
//             <button type="submit" className="btn btn-primary">Create Room</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default HomePage;


// // components/HomePage.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { setRoomState } from '../store/roomSlice';

// function HomePage() {
//   const [roomName, setRoomName] = useState('DevTEAM');
//   const [userName, setUserName] = useState('ANTONIO');
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleCreateRoom = (e) => {
//     e.preventDefault();
//     if (!roomName.trim() || !userName.trim()) return;

//     const roomId = `room-${Date.now()}`;
//     const creator = {
//       name: userName,
//       isModerator: true,
//       vote: null,
//       hasVoted: false,
//     };
    
//     const initialRoomState = {
//       roomId, // Include the ID in the state payload
//       roomName,
//       participants: { [userName]: creator },
//       stories: [],
//       activeStoryId: null,
//       votesRevealed: false,
//     };
    
//     // Dispatch the action to set up the room in Redux.
//     // The middleware will handle saving to localStorage.
//     dispatch(setRoomState(initialRoomState));

//     // Navigate, passing the creator's info in the location state.
//     navigate(`/room/${roomId}`, {
//       state: { currentUser: creator },
//     });
//   };

//   return (
//     <div className="card shadow">
//         {/* The JSX for this component remains exactly the same */}
//         <div className="card-body">
//             <h2 className="card-title text-center">Create a New Room</h2>
//             <form onSubmit={handleCreateRoom}>
//             <div className="mb-3">
//                 <label htmlFor="roomName" className="form-label">Room Name:</label>
//                 <input id="roomName" type="text" className="form-control" value={roomName} onChange={(e) => setRoomName(e.target.value)} required />
//             </div>
//             <div className="mb-3">
//                 <label htmlFor="userName" className="form-label">Your Name (Moderator):</label>
//                 <input id="userName" type="text" className="form-control" value={userName} onChange={(e) => setUserName(e.target.value)} required />
//             </div>
//             <div className="d-grid">
//                 <button type="submit" className="btn btn-primary">Create Room</button>
//             </div>
//             </form>
//       </div>
//     </div>
//   );
// }

// export default HomePage;
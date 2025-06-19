// //components/RoomPage.js
// import React, { useState, useEffect } from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// import { useRoomState } from '../hooks/useRoomState';

// const VOTING_OPTIONS = [1, 2, 3, 5, 8, 13, '☕', '?'];

// function RoomPage() {
//   const { roomId } = useParams();
//   const location = useLocation();

//   // This destructuring now correctly matches the hook's return values
//   const [roomState, updateAndBroadcastState, setInitialState] = useRoomState(roomId);

//   // Local state for the current user and UI inputs
//   const [currentUser, setCurrentUser] = useState(location.state?.currentUser);
//   const [newStoryTitle, setNewStoryTitle] = useState('');
//   const [newStoryDesc, setNewStoryDesc] = useState('');

//   // Effect to initialize the room state or join as a new user
//   useEffect(() => {
//     if (!roomState) {
//       const storedState = sessionStorage.getItem(roomId);
//       if (storedState) {
//         // This user created the room, so they load the initial state
//         const initialState = JSON.parse(storedState);
//         // Using the new 'setInitialState' function
//         setInitialState(initialState);
//         sessionStorage.removeItem(roomId); // Clean up
//       }
//     } else if (currentUser && !roomState.participants[currentUser.name]) {
//       // Add the current user to the participants list and broadcast the update
//       const newState = {
//         ...roomState,
//         participants: {
//           ...roomState.participants,
//           [currentUser.name]: currentUser,
//         },
//       };
//       updateAndBroadcastState(newState);
//     }
//     // The dependency array is now correct, using 'setInitialState'
//   }, [roomId, currentUser, roomState, setInitialState, updateAndBroadcastState]);

//   // Handler for joining the room
//   const handleJoinRoom = (name) => {
//     if (!name.trim()) return alert('Please enter your name.');
//     if (roomState && roomState.participants[name]) return alert('This name is already taken.');
    
//     const newUser = { name, isModerator: false, vote: null, hasVoted: false };
//     setCurrentUser(newUser);
//   };
  
//   // === MODERATOR ACTIONS ===
//   const addStory = () => {
//     if (!newStoryTitle.trim()) return;
//     const newStory = { id: `story-${Date.now()}`, title: newStoryTitle, description: newStoryDesc };
//     const newState = {
//       ...roomState,
//       stories: [...roomState.stories, newStory],
//       activeStoryId: roomState.activeStoryId || newStory.id, // Auto-select first story
//       votesRevealed: false,
//     };
//     Object.values(newState.participants).forEach(p => {
//       p.hasVoted = false;
//       p.vote = null;
//     });
//     updateAndBroadcastState(newState);
//     setNewStoryTitle('');
//     setNewStoryDesc('');
//   };
  
//   const revealVotes = () => {
//     updateAndBroadcastState({ ...roomState, votesRevealed: true });
//   };
  
//   const startNewRound = () => {
//     const newState = { ...roomState, votesRevealed: false, activeStoryId: null };
//      Object.values(newState.participants).forEach(p => {
//       p.hasVoted = false;
//       p.vote = null;
//     });
//     updateAndBroadcastState(newState);
//   };
  
//   // === PLAYER ACTIONS ===
//   const castVote = (vote) => {
//     const newParticipants = { ...roomState.participants };
//     newParticipants[currentUser.name] = { ...currentUser, vote: vote, hasVoted: true };
//     updateAndBroadcastState({ ...roomState, participants: newParticipants });
//   };
  
//   // === UTILITY ===
//   const copyLink = () => {
//     navigator.clipboard.writeText(window.location.href)
//       .then(() => alert('Room link copied to clipboard!'));
//   };

//   // Loading or Join Screen
//   if (!roomState) {
//     return (
//       <div className="text-center">
//         <h2>Loading Room...</h2>
//         <p>If the room doesn't load, please check the link and make sure the creator's tab is still open.</p>
//         <p>(Note: Does not work between a regular and an Incognito browser window).</p>
//       </div>
//     );
//   }
  
//   if (!currentUser) {
//     return <JoinScreen onJoin={handleJoinRoom} roomName={roomState.roomName} />;
//   }

//   // Derived state
//   const participants = Object.values(roomState.participants);
//   const activeStory = roomState.stories.find(s => s.id === roomState.activeStoryId);
//   const allPlayersVoted = participants.every(p => p.hasVoted);

//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h2>Room: {roomState.roomName}</h2>
//         <div>
//           <span>Welcome, <strong>{currentUser.name}</strong></span>
//           {currentUser.isModerator && <span className="badge bg-primary ms-2">Moderator</span>}
//         </div>
//       </div>
      
//       <button onClick={copyLink} className="btn btn-outline-primary mb-4">
//         📋 Copy Room Link
//       </button>

//       <div className="row">
//         {/* Left Column: Participants & Moderator Controls */}
//         <div className="col-md-4">
//           <div className="card">
//             <div className="card-header">Participants ({participants.length})</div>
//             <ul className="list-group list-group-flush">
//               {participants.map(p => (
//                 <li key={p.name} className="list-group-item d-flex justify-content-between align-items-center">
//                   <span>
//                     {p.name} {p.isModerator && '👑'}
//                     {p.hasVoted && !roomState.votesRevealed && ' ✅'}
//                   </span>
//                   {roomState.votesRevealed && <span className="badge bg-success fs-6">{p.vote}</span>}
//                 </li>
//               ))}
//             </ul>
//           </div>
//           {currentUser.isModerator && (
//             <div className="card mt-4">
//               <div className="card-header">Moderator Controls</div>
//               <div className="card-body">
//                 <div className="mb-3">
//                   <input type="text" className="form-control mb-2" placeholder="Story Title" value={newStoryTitle} onChange={e => setNewStoryTitle(e.target.value)} />
//                   <textarea className="form-control" placeholder="Story Description (optional)" value={newStoryDesc} onChange={e => setNewStoryDesc(e.target.value)}></textarea>
//                 </div>
//                 <button className="btn btn-secondary w-100 mb-2" onClick={addStory}>Add & Start Story</button>
//                 <button className="btn btn-success w-100 mb-2" onClick={revealVotes} disabled={!allPlayersVoted || roomState.votesRevealed}>Reveal Votes</button>
//                 <button className="btn btn-warning w-100" onClick={startNewRound}>Start New Round</button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Column: Story & Voting */}
//         <div className="col-md-8">
//           <div className="card">
//             <div className="card-header">Active Story</div>
//             <div className="card-body" style={{ minHeight: '150px' }}>
//               {activeStory ? (
//                 <>
//                   <h4 className="card-title">{activeStory.title}</h4>
//                   <p className="card-text">{activeStory.description}</p>
//                 </>
//               ) : (
//                 <p className="text-muted">Moderator will add a story to begin voting.</p>
//               )}
//             </div>
//           </div>
          
//           {activeStory && !roomState.votesRevealed && (
//              <div className="card mt-4">
//                 <div className="card-header">Cast Your Vote</div>
//                 <div className="card-body d-flex flex-wrap justify-content-center gap-2">
//                     {VOTING_OPTIONS.map(vote => (
//                         <button 
//                             key={vote} 
//                             className="btn btn-lg btn-outline-primary"
//                             onClick={() => castVote(vote)}
//                             disabled={roomState.participants[currentUser.name]?.hasVoted}
//                         >
//                             {vote}
//                         </button>
//                     ))}
//                 </div>
//                 {roomState.participants[currentUser.name]?.hasVoted && (
//                     <div className="card-footer text-center text-success">
//                         Your vote is in! Waiting for others.
//                     </div>
//                 )}
//              </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // A simple component for the join screen
// function JoinScreen({ onJoin, roomName }) {
//     const [name, setName] = useState('MARIA');
//     return (
//         <div className="card shadow w-50 mx-auto">
//             <div className="card-body">
//                 <h3 className="card-title text-center">Join Room: {roomName}</h3>
//                 <form onSubmit={(e) => { e.preventDefault(); onJoin(name); }}>
//                     <div className="mb-3">
//                         <label htmlFor="joinName" className="form-label">Your Name:</label>
//                         <input
//                             id="joinName"
//                             type="text"
//                             className="form-control"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             autoFocus
//                         />
//                     </div>
//                     <div className="d-grid">
//                         <button type="submit" className="btn btn-primary">Join Room</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default RoomPage;


// // components/RoomPage.js
// import React, { useState, useEffect } from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// // Import Redux tools and our actions
// import { useSelector, useDispatch } from 'react-redux';
// import { setRoomState, addStory, castVote, revealVotes, startNewRound, addParticipant } from '../store/roomSlice';

// const VOTING_OPTIONS = [1, 2, 3, 5, 8, 13, '☕', '?'];

// function RoomPage() {
//   const { roomId } = useParams();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   // Get the entire room state from the Redux store
//   const roomState = useSelector(state => state.room);
  
//   // Local state for the current user and form inputs
//   const [currentUser, setCurrentUser] = useState(location.state?.currentUser);
//   const [newStoryTitle, setNewStoryTitle] = useState('');
//   const [newStoryDesc, setNewStoryDesc] = useState('');

//   // Effect to initialize the state on first load or when a new user joins
//   useEffect(() => {
//     // On first load, if Redux state is empty, try to load from localStorage
//     if (!roomState.roomId) {
//       const storedState = localStorage.getItem(roomId);
//       if (storedState) {
//         const fullState = { roomId, ...JSON.parse(storedState) };
//         dispatch(setRoomState(fullState));
//       }
//     }
    
//     // If we have a user, but they aren't in the participants list yet, add them.
//     if (currentUser && roomState.roomId && !roomState.participants[currentUser.name]) {
//       dispatch(addParticipant(currentUser));
//     }
//   }, [currentUser, roomState.roomId, roomState.participants, roomId, dispatch]);

//   const handleJoinRoom = (name) => {
//     if (!name.trim() || (roomState.participants && roomState.participants[name])) return;
//     const newUser = { name, isModerator: false, vote: null, hasVoted: false };
//     setCurrentUser(newUser);
//   };
  
//   // All actions now just dispatch to Redux
//   const handleAddStory = () => {
//     if (!newStoryTitle.trim()) return;
//     const newStory = { id: `story-${Date.now()}`, title: newStoryTitle, description: newStoryDesc };
//     dispatch(addStory(newStory));
//     setNewStoryTitle(''); setNewStoryDesc('');
//   };
  
//   const handleRevealVotes = () => dispatch(revealVotes());
//   const handleStartNewRound = () => dispatch(startNewRound());
//   const handleCastVote = (vote) => dispatch(castVote({ userName: currentUser.name, vote }));
  
//   const copyLink = () => navigator.clipboard.writeText(window.location.href).then(() => alert('Room link copied!'));

//   // Render logic
//   if (!roomState.roomId) {
//     return <div className="text-center"><h2>Room not found or is loading...</h2></div>;
//   }
  
//   if (!currentUser) {
//     return <JoinScreen onJoin={handleJoinRoom} roomName={roomState.roomName} />;
//   }
  
//   const participants = Object.values(roomState.participants);
//   const activeStory = roomState.stories.find(s => s.id === roomState.activeStoryId);
//   const allPlayersVoted = participants.every(p => p.hasVoted);

//   // The JSX for this component remains almost identical.
//   // We just call the new handler functions (e.g., onClick={handleAddStory}).
//   return (
//     <div>
//        <div className="d-flex justify-content-between align-items-center mb-3">
//         <h2>Room: {roomState.roomName}</h2>
//         <div>
//           <span>Welcome, <strong>{currentUser.name}</strong></span>
//           {currentUser.isModerator && <span className="badge bg-primary ms-2">Moderator</span>}
//         </div>
//       </div>
//       <button onClick={copyLink} className="btn btn-outline-primary mb-4">📋 Copy Room Link</button>
//       <div className="row">
//         <div className="col-md-4">
//           <div className="card">
//             <div className="card-header">Participants ({participants.length})</div>
//             <ul className="list-group list-group-flush">
//               {participants.map(p => (
//                 <li key={p.name} className="list-group-item d-flex justify-content-between align-items-center">
//                   <span>
//                     {p.name} {p.isModerator && '👑'}
//                     {p.hasVoted && !roomState.votesRevealed && ' ✅'}
//                   </span>
//                   {roomState.votesRevealed && <span className="badge bg-success fs-6">{p.vote}</span>}
//                 </li>
//               ))}
//             </ul>
//           </div>
//           {currentUser.isModerator && (
//             <div className="card mt-4">
//               <div className="card-header">Moderator Controls</div>
//               <div className="card-body">
//                 <input type="text" className="form-control mb-2" placeholder="Story Title" value={newStoryTitle} onChange={e => setNewStoryTitle(e.target.value)} />
//                 <textarea className="form-control" placeholder="Story Description (optional)" value={newStoryDesc} onChange={e => setNewStoryDesc(e.target.value)}></textarea>
//                 <button className="btn btn-secondary w-100 mt-2 mb-2" onClick={handleAddStory}>Add & Start Story</button>
//                 <button className="btn btn-success w-100 mb-2" onClick={handleRevealVotes} disabled={!allPlayersVoted || roomState.votesRevealed}>Reveal Votes</button>
//                 <button className="btn btn-warning w-100" onClick={handleStartNewRound}>Start New Round</button>
//               </div>
//             </div>
//           )}
//         </div>
//         <div className="col-md-8">
//           <div className="card">
//             <div className="card-header">Active Story</div>
//             <div className="card-body" style={{ minHeight: '150px' }}>
//               {activeStory ? (<><h4 className="card-title">{activeStory.title}</h4><p className="card-text">{activeStory.description}</p></>) : (<p className="text-muted">Moderator will add a story to begin voting.</p>)}
//             </div>
//           </div>
//           {activeStory && !roomState.votesRevealed && (
//              <div className="card mt-4">
//                 <div className="card-header">Cast Your Vote</div>
//                 <div className="card-body d-flex flex-wrap justify-content-center gap-2">
//                     {VOTING_OPTIONS.map(vote => (<button key={vote} className="btn btn-lg btn-outline-primary" onClick={() => handleCastVote(vote)} disabled={roomState.participants[currentUser.name]?.hasVoted}>{vote}</button>))}
//                 </div>
//                 {roomState.participants[currentUser.name]?.hasVoted && <div className="card-footer text-center text-success">Your vote is in! Waiting for others.</div>}
//              </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// function JoinScreen({ onJoin, roomName }) {
//     const [name, setName] = useState('MARIA');
//     return (
//         <div className="card shadow w-50 mx-auto">
//             <div className="card-body">
//                 <h3 className="card-title text-center">Join Room: {roomName}</h3>
//                 <form onSubmit={(e) => { e.preventDefault(); onJoin(name); }}>
//                     <div className="mb-3">
//                         <label htmlFor="joinName" className="form-label">Your Name:</label>
//                         <input id="joinName" type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
//                     </div>
//                     <div className="d-grid"><button type="submit" className="btn btn-primary">Join Room</button></div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default RoomPage;
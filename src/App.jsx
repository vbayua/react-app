import { useState, useEffect } from 'react'
import Button from './Components/Button'
import personService from './services/persons'
// import noteService from './services/notes'
// import Note from './Components/Note'

import './index.css'


// const Footer = () => {
//   const footerStyle = {
//     color: 'green',
//     fontSize: 16,
//     fontStyle: 'italic'
//   }
//   return(
//     <>
//       <footer style={footerStyle}>
//         <br />
//         <em>Note App 2024</em>
//       </footer>
//     </>
//   )
// }

// function App() {
//   const [notes, setNotes] = useState([])
//   const [newNote, setNewNote] = useState({content: ''})
//   const [showAll, setNoteFilter] = useState(true)
  
//   useEffect(() => {
//     noteService
//       .getAll()
//       .then(initialNotes => {
//         setNotes(initialNotes)
//       })
//   }, [])

//   const saveNote = (e) => {
//     e.preventDefault()
//     const noteId = notes.length + 1
//     const noteObject = {
//       content: newNote.content,
//       important: Math.random < 0.5,
//       id: noteId.toString()
//     } 

//     noteService.create(noteObject)
//       .then(returnedNote => {
//         setNotes(notes.concat(returnedNote))
//         setNewNote({content: ''})
//       })
//       .catch(error => console.log(error))
//   }

//   const handleInputContentChange = (e) => {
//     // console.log(e.target.value)
//     setNewNote({
//       [e.target.name] : [e.target.value]
//     })
//   }

//   const filterImportant = () => {
//     setNoteFilter(!showAll)
//   }
  
//   const notesToShow = showAll ? notes : notes.filter(note => note.important)

//   const toggleImportanceOf = id => {
//     const note = notes.find(n => n.id === id)
//     const changedNote = { ...note, important: !note.important }

//     noteService
//       .update(id, changedNote).then(returnedNote => {
//         setNotes(notes.map(note => note.id !== id ? note : returnedNote))
//         setNewNote('')
//       })
//       .catch(error => {
//         console.log(`note is already deleted : ${error}`)
//       })
//   }
//   return (
//     <>
//       <form onSubmit={saveNote} >
//         <label>
//           <input 
//             type="text"
//             name='content'
//             value={newNote.content}
//             onChange={handleInputContentChange}
//           />
//         </label>
//         <button type='submit'>save</button>
//       </form>
//       <h1>Notes</h1>
//       <div>
//         <Button text={showAll ? `filter important` : `show all`} onClick={filterImportant} />
//       </div>
//       {notesToShow.map(note => 
//         <Note 
//           key={note.id} 
//           note={note} 
//           toggleImportance={() => toggleImportanceOf(note.id)} />
//       )}

//       <Footer />
//     </>
//   )
// }

const Search = ({value, onChange}) => {
  return(
    <>
      <form>
        <label htmlFor="">Search</label>
        <input type="text" name='search' value={value} onChange={onChange}  />
      </form>
    </>
  )
}

const PersonList = ({person, deletePerson}) => {
  return(
    <>
      <li>
        {person.name}
        {person.number}
        <button onClick={deletePerson}>delete</button>
      </li>
    </>
  )
}

const Notification = ({status, message}) => {
  if (message === null && status === null) {
    return null
  }

  const styles = {
    error: {
      padding: 20,
      backgroundColor: 'red',
      color: 'black'
    },
    success: {
      padding: 20,
      backgroundColor: 'green',
      color: 'black'
    }
  }

  let style = null;

  switch (status) {
    case 'error':
      style = styles.error
      break;
    
    case 'success':
      style = styles.success
      break;
    default:
      style
      break;
  }
  return(
    <>
      <div style={style}>{message}</div>
    </>
  )
}

function App() {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({
    name: '',
    number: ''
  })
  const [messageStatus, setMessageStatus] = useState({
    status: '',
    message: ''
  })

  const [search, setSearch] = useState('')
  const [filteredData, setFilteredData] = useState(persons)
  
  useEffect(() => {
    // TODO FETCH LISTS
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  useEffect(() => { 
    const filtered = persons.filter(person => 
      person.name.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredData(filtered)
  }, [persons, search])

  const saveContact = (e) => {
    e.preventDefault()
    const {name, number} = newPerson
    const isPersonExist = persons.find(person => person.name.toLowerCase() === name.toString().toLowerCase())
    
    if(isPersonExist) {
      const personObject = { 
        ...isPersonExist,
        number
      }

      personService.update(isPersonExist.id, personObject)
        .then(returnedData => {
          setPersons(persons.map(person => person.id !== isPersonExist.id ? person : returnedData))
          setNewPerson({name: '', number: ''})
          setMessageStatus({
            status: 'success',
            message: 'Person Updated'
          })
          
        })
        .finally(() => {
          setTimeout(() => {
            setMessageStatus({
              status: '',
              message: ''
            })
          }, 3000)
        })

    } else {
      const id = persons.length + 1
      const personObject = {
        id: id.toString(),
        name,
        number
      }

      personService.create(personObject)
        .then(returnedData => {
          setPersons(persons.concat(returnedData))
          setNewPerson({name: '', number: ''})
        })

      console.log('New person added')
    }
  }

  const handleSearch = (e) => {
    const searchValue = e.target.value
    setSearch(searchValue)
  }

  const handleDeleteButton = id => {
    // const person = persons.find(p => p.id === id)
    if (window.confirm('Are you sure ?')) {
      personService.destroy(id)
        .then(returnedPersons => {
        const updatedPerson = persons.filter(person => person.id !== id)
        setPersons(updatedPerson)
        })
        .catch(error => {
          console.log(`Error deleting person : ${error}`)
        })
    }
  }

  const onNameChange = (e) => {
    const name = e.target.value
    setNewPerson({...newPerson, name})
  }

  const onNumberChange = (e) => {
    const number = e.target.value
    setNewPerson({...newPerson, number})
  }

  return (
    <>
      <h1>Phonebook</h1>
      {/* TODO FILTER */}
      <Search value={search} onChange={handleSearch} />
      <h2>Add new</h2>
      <Notification message={messageStatus.message} status={messageStatus.status} />
      {/* TODO NEW */}
      <div>
        <form onSubmit={saveContact}>
          <input type="text" value={newPerson.name} name='name' placeholder='Name' onChange={onNameChange} />
          <br />
          <input type="text" value={newPerson.number} name='number' placeholder='Number' onChange={onNumberChange} />
          <br />
          <button type='submit'>Save</button>
        </form>
      </div>

      <div>
        <h2>List of Contact</h2>
        {/* TODO LIST OF PERSONS */}
        <ol>
          {filteredData.map(person => 
            <PersonList key={person.id} person={person} deletePerson={() => handleDeleteButton(person.id)}/>
          )}
        </ol>
      </div>
      
    </>
  )
}

export default App

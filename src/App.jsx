import { useState, useEffect } from 'react'
import Button from './Components/Button'
import noteService from './services/notes'
import Note from './Components/Note'

import './index.css'


const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontSize: 16,
    fontStyle: 'italic'
  }
  return(
    <>
      <footer style={footerStyle}>
        <br />
        <em>Note App 2024</em>
      </footer>
    </>
  )
}

function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState({content: ''})
  const [showAll, setNoteFilter] = useState(true)
  const [search, setSearch] = useState('')
  
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const filtered = notes.filter(note => 
      note.content.toLowerCase().includes(search.toLowerCase())
    )
    setNotes(filtered)
  }, [search, notes])

  const saveNote = (e) => {
    e.preventDefault()
    const noteId = notes.length + 1
    const noteObject = {
      content: newNote.content.toString(),
      important: Math.random < 0.5,
      id: noteId.toString()
    } 

    noteService.create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote({content: ''})
      })
      .catch(error => console.log(error))
  }

  const handleInputContentChange = (e) => {
    // console.log(e.target.value)
    setNewNote({
      [e.target.name] : [e.target.value]
    })
  }

  const handleSearchChange = (e) => {
    const search = e.target.value
    setSearch(search)
  }

  const filterImportant = () => {
    setNoteFilter(!showAll)
  }
  
  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
        setNewNote('')
      })
      .catch(error => {
        console.log(`note is already deleted : ${error}`)
      })
  }

  return (
    <>
      <form>
        <label>
          <input 
            type="text"
            name='search'
            value={search}
            placeholder='Search content'
            onChange={handleSearchChange}
          />
        </label>
        <button type='submit'>save</button>
      </form>
      <form onSubmit={saveNote} >
        <label>
          <input 
            type="text"
            name='content'
            value={newNote.content}
            placeholder='Insert new note'
            onChange={handleInputContentChange}
          />
        </label>
        <button type='submit'>save</button>
      </form>
      <h1>Notes</h1>
      <div>
        <Button text={showAll ? `filter important` : `show all`} onClick={filterImportant} />
      </div>
      {notesToShow.map(note => 
        <Note 
          key={note.id} 
          note={note} 
          toggleImportance={() => toggleImportanceOf(note.id)} />
      )}

      <Footer />
    </>
  )
}

export default App

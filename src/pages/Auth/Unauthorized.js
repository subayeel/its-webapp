import React from 'react'
import { Link } from 'react-router-dom'

function Unauthorized() {
  return (
    <div>Unauthorized <Link to="/">Relogin</Link></div>
  )
}

export default Unauthorized
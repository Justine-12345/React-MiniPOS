import React, { useEffect, useRef, useState, memo } from 'react'
import { getAuthUser } from 'actions/auth'

const Name = () => {
    return (
        <span>{window.localStorage.getItem('username')} ({window.localStorage.getItem('role')}) </span>
    )
}


export default memo(Name);
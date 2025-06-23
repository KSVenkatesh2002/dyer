import React from 'react'

const NoData = ({text}) => {
    return (
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
            {text}
        </div>
    )
}

export default NoData
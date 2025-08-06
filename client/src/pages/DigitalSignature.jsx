import React from 'react'
import SignatureCanvas from 'react-signature-canvas'


const DigitalSignature = () => {
  return (
    <div>
        <SignatureCanvas
        penColor='black'
        canvasProps={{width: 500, height: 200, className: 'sigCanvas bg-gray-200'}}
        />
    </div>
  )
}

export default DigitalSignature
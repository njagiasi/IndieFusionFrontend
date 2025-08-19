import React from 'react';
const noPost = '/Images/NoDataFoundImage.jpg';

function NoDataFound() {
  return (
    <div className={'d-flex align-items-center flex-column pt-4'}>
            <div>
                <img src={noPost} alt='No Post Found' />
            </div>
        </div>
  )
}

export default NoDataFound
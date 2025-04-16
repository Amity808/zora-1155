import React from 'react'

type Props = {}

const ArtifactCard = (props: Props) => {
    
    return (
        <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
                <img
                    src="/artifact.webp"
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    Mongolia Tomb
                    <div className="badge badge-secondary">Artifact</div>
                </h2>
                <p>This is a mongolia tomb, which serves as a sacred tomb for the mongolia. Read for ....</p>
                <div className="card-actions justify-end">
                    <div className="badge badge-outline">Historical</div>
                    <div className="badge badge-outline cursor-pointer" >Read More</div>
                </div>
            </div>
        </div>
    )
}

export default ArtifactCard
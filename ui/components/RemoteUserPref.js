import React from "react";
import { createUseRemoteComponent, getDependencies, createRequires } from "@paciolan/remote-component";
import CircularProgress from "@material-ui/core/CircularProgress";


const requires = createRequires(getDependencies);

const useRemoteComponent = createUseRemoteComponent({
  requires
});

const RemoteUserPref = ({ startOnZoom, handleToggle, url }) => {
  const [loading, err, RemoteComponent] = useRemoteComponent(url);
  if (loading) {
    return (
      <CircularProgress />
    );
  }
  if (err != null) {
    return <div>Unknown Error: {err.toString()}</div>;
  }

  return (
    <div>
      <RemoteComponent
        startOnZoom={startOnZoom}
        handleToggle={handleToggle}
      />
    </div>
  );
}

export default RemoteUserPref;

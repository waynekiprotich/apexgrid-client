import os
pages = ['Home', 'Dashboard', 'DriverDetails', 'Teams', 'Sessions', 'RaceCenter', 'Analytics', 'Favorites', 'Profile', 'Login', 'Register']

for page in pages:
    content = f"""import React from 'react';

const {page} = () => {{
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-accent">{page}</h1>
      <p className="text-gray-400">Coming soon in a later phase.</p>
    </div>
  );
}};

export default {page};
"""
    with open(f"/Users/mac/Developer/ApexGrid/frontend/src/pages/{page}.jsx", "w") as f:
        f.write(content)

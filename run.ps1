try {
    pushd src

    # Create data from initial_data
    if (!(Test-Path "data")){
        robocopy initial_data data
    }

    echo "Ensuring python is installed..."
    python --version

    echo "Visiting http://localhost:8001/todo.html..."
    explorer http://localhost:8001/todo.html

    echo "Launching GET_POST_files.py with Python 2.7..." 
    python GET_POST_files.py

} finally {
    popd
}
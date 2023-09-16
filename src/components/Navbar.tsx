import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container">
                <Link className="navbar-brand" to={'/'}>
                MedForce-Training
                </Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to={'/'}>
                            Form
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={'table'}>
                            Table
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={'table2'}>
                            Table2
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={'email-editor'}>
                            Email Editor
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={'gantt-chart'}>
                            Gantt Chart
                        </Link>
                    </li>
                </ul>
            </div>
          </div>
        </nav>
        </>
    );
};
export default Navbar;
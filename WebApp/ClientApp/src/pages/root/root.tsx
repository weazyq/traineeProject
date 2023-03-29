import { Outlet, Link } from "react-router-dom"

export function Root(){
    return(
        <div style={{width: 1280, display: "flex", flexDirection: "column", gap: 30, alignItems:"center"}}>
            <div>
                <nav>
                    <ul>
                        <li>
                          <Link to={`/`}>Главная</Link>  
                        </li>
                        <li>
                            <Link to={`/products/`}>Продукты</Link>
                        </li>
                        <li>
                            <Link to={`/groups/`}>Группы</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div id="detail" style={{width: "100%"}}>
                <Outlet/>
            </div>
        </div>
    )
}
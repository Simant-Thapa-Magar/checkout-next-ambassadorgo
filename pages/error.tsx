import Layout from "../components/layout"

const Error = () => {
    return (<Layout>
        <div className="row">
            <div className="col-md-12">
                <div className="error-template">

                    <h1>
                        <i className="fa fa-times" aria-hidden="true"></i>   Oops!</h1>
                    <h2>
                        Something went wrong</h2>
                    <div className="error-details">
                        Sorry, an error has occured, Please try again later!
                    </div>
                </div>
            </div>
        </div>
    </Layout>)
}

export default Error
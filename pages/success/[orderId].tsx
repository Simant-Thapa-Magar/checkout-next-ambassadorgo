import { useEffect, useState } from "react"
import Layout from "../../components/layout"
import { useRouter } from "../../node_modules/next/router"
import defaults from "../../constants"
import axios from "../../node_modules/axios/index"

const Success = () => {
    const router = useRouter()
    const { orderId, refId } = router.query
    const [isProcessing, setProcessing] = useState<Boolean>(true)
    const [isSuccess, setSuccess] = useState<Boolean>(false)

    useEffect(() => {
        if (orderId && refId) {
            (async () => {
                try {
                    const { data } = await axios.post(`${defaults.checkoutAPI}/orders/complete`, {
                        order_id: Number(orderId),
                        transaction_id: refId
                    })
                    setSuccess(true)
                } catch (e) {
                    console.log("error ", e)
                    setSuccess(false)
                } finally {
                    setProcessing(false)
                }
            })()
        }
    }, [orderId, refId])

    if (isProcessing) {
        return (<Layout>
            Please wait, we are processing your order
        </Layout>)
    }

    if (!isSuccess) {
        router.push('/error')
        return <></>
    }

    return (<Layout>
        <div className="row">
            <div className="col-md-6 mx-auto mt-5">
                <div className="payment">
                    <div className="payment_header">
                        <div className="check"><i className="fa fa-check" aria-hidden="true"></i></div>
                    </div>
                    <div className="content">
                        <h1>Payment Success !</h1>
                        <p>Thank you. Your order has been completed !</p>
                    </div>

                </div>
            </div>
        </div>
    </Layout>)
}

export default Success
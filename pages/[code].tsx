import { useEffect, useState } from 'react'
import Layout from '../components/layout'
import axios from '../node_modules/axios/index'
import { useRouter } from '../node_modules/next/router'
import defaults from "../constants"

export default function Home() {
  const [user, setUser] = useState({
    first_name: "",
    last_name: ""
  })
  const [products, setProducts] = useState([])
  const [quantities, setQuantites] = useState([])
  const [total, setTotal] = useState(0)
  const [orderInfo, setOrderInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    country: "",
    zip: "",
  })
  const router = useRouter()
  const { code } = router.query

  useEffect(() => {
    if (code) {
      (async () => {
        const { data } = await axios.get(`${defaults.checkoutAPI}/links/${code}`)
        setUser(data.user)
        setProducts(data.products)
        setQuantites(data.products.map(product => ({ product_id: product.id, quantity: 0 })))
      })()
    }
  }, [code])

  useEffect(() => {
    setTotal(quantities.reduce((s, q) => {
      const product = products.find(p => p.id === q.product_id)
      return s + (product.price * q.quantity)
    }, 0))
  }, [quantities])

  const handleQuantityChange = (product_id: number, quantity: number) => {
    setQuantites(quantities.map(q => {
      if (q.product_id == product_id) {
        return {
          ...q,
          quantity: Number(quantity)
        }
      }
      return q
    }))
  }

  const handleOrderInfo = (e: any) => {
    setOrderInfo({ ...orderInfo, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (total === 0) {
      alert("Your order total is 0")
      return
    }
    try {
      const { data } = await axios.post(`${defaults.checkoutAPI}/orders`, {
        ...orderInfo,
        code,
        products: quantities
      })
      console.log("order data ", data)
      alert("Order created ")
    } catch (e) {
      alert("Failed to create order")
    }
  }

  return (
    <Layout>
      <main>
        <div className="py-5 text-center">
          <h2>Checkout form</h2>
          <p className="lead">{user.first_name} {user.last_name} has invited you to purchase these products</p>
        </div>

        <div className="row g-5">
          <div className="col-md-5 col-lg-4 order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-pill">3</span>
            </h4>
            <ul className="list-group mb-3">
              {products.map(product => (
                <li className="list-group-item d-flex justify-content-between lh-sm" key={product.id}>
                  <div>
                    <h6 className="my-0">{product.title}</h6>
                    <small className="text-muted">{product.description}</small>
                  </div>
                  <span className="text-muted">{product.price}</span>
                  &times;
                  <input type="number" min="0" name="quantity" className="form-control" style={{ maxWidth: "100px" }} onChange={(e: any) => handleQuantityChange(product.id, e.target.value)} />
                </li>
              ))}


              <li className="list-group-item d-flex justify-content-between">
                <span>Total </span>
                <strong>${total}</strong>
              </li>
            </ul>

          </div>
          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Billing address</h4>
            <form className="needs-validation" onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="firstName" className="form-label">First name</label>
                  <input type="text" className="form-control" name="first_name" placeholder="" value={orderInfo.first_name} required onChange={handleOrderInfo} />
                  <div className="invalid-feedback">
                    Valid first name is required.
                  </div>
                </div>

                <div className="col-sm-6">
                  <label htmlFor="lastName" className="form-label">Last name</label>
                  <input type="text" className="form-control" name="last_name" placeholder="" value={orderInfo.last_name} required onChange={handleOrderInfo} />
                  <div className="invalid-feedback">
                    Valid last name is required.
                  </div>
                </div>


                <div className="col-12">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" placeholder="you@example.com" required onChange={handleOrderInfo} />
                  <div className="invalid-feedback">
                    Please enter a valid email address for shipping updates.
                  </div>
                </div>

                <div className="col-12">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input type="text" className="form-control" name="address" placeholder="1234 Main St" required onChange={handleOrderInfo} />
                  <div className="invalid-feedback">
                    Please enter your shipping address.
                  </div>
                </div>

                <div className="col-12">
                  <label htmlFor="city" className="form-label">City</label>
                  <input type="text" className="form-control" name="city" placeholder="eg Manhattom" required onChange={handleOrderInfo} />
                </div>

                <div className="col-md-5">
                  <label htmlFor="country" className="form-label">Country</label>
                  <input type="text" className="form-control" name="country" placeholder="eg USA" required onChange={handleOrderInfo} />
                  <div className="invalid-feedback">
                    Please enter a valid country.
                  </div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="zip" className="form-label">Zip</label>
                  <input type="text" className="form-control" name="zip" placeholder="" required onChange={handleOrderInfo} />
                  <div className="invalid-feedback">
                    Zip code required.
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              <button className="w-100 btn btn-primary btn-lg mb-4" type="submit">Continue to checkout</button>
            </form>

          </div>
        </div>
      </main>
    </Layout>
  )
}

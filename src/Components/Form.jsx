import React, { useState } from 'react'

const Form = () => {

  const [selectedResource,setSelectedResource] = useState('')
  const [data,setData] = useState([{
    
  }])
  const [estimation,setEstimation] = useState([{
    resource:'',
    region:'',
    unit:0,
    perUnit:0,
    perService:0
  }])
  const [isEstimated,setIsEstimated] = useState(false)
  const [cost,setCost] = useState(0)

  const estimationMap = estimation.map(
    (estimation,index)=>
       <section className='container' key={index}>
        
        <p><strong>Service:</strong> {estimation.resource}</p>
        <p><strong>Region:</strong> {estimation.region}</p>
        <p><strong>Unit:</strong> {estimation.unit}</p>
        <p><strong>Cost per Unit:</strong> ₹{estimation.perUnit}</p>
        <p><strong>Total Cost: ₹{estimation.perService}</strong></p>
        
      </section>
      

    
  )
  



  const services = {
    compute:["ECS","EC2","lambda"],
    database:["RDS","DynamoDb"],
    storage:["S3","EBS"]
  }

  function addOnClick(e){
    e.preventDefault()
    const formData = new FormData(e.target.form)
    const resource = formData.get('service')
    const region = formData.get('region')
    const unit = formData.get('unit')
    if(!resource || !region || !unit){
      alert("please add every field before adding!!")
      return
    }
    const arr ={
      resource,      
      region,
      unit
    }
    setData(
      prev => [...prev,arr]
    )
    e.target.form.reset()
  }



  function handlesubmit(formData){
    
    
    
    console.log(data)
    
    fetch("http://localhost:8080/price_calculation",{
          method:'POST',
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify(data)
       }
    ).then(res => 
      res.json()
      
    )
    .then(data => {
      console.log(data)
      setIsEstimated(true)
      setEstimation(data.array)
      setSelectedResource(null)
      setCost(data.cost)
    }
    )
    
  }


  return (
    <>
      <div className='main-class'>
        <form action={handlesubmit}>

          <label htmlFor="resource">Resource Type:</label>
          <select name="resource" id="resource" onChange={(e)=>{
              setSelectedResource(e.target.value)
          }}>
                  <option value="" >select resource type</option>
                  <option value="compute">compute</option>
                  <option value="database">database</option>
                  <option value="storage">storage</option>
          </select>

          {selectedResource && 
 
            <>
              <label htmlFor="service">{selectedResource} service:</label>
              <select  name="service" id="service" >
                  <option value="">select service</option>
                  {
                    services[selectedResource].map(
                      (item)=>
                        <option key={item} value={item} >{item}</option>

                      
                    )
                  }

              </select>

              <label htmlFor="unit">Unit</label>
              <input type="number" name='unit' id='unit' placeholder='enter the total unit' />

              <label htmlFor="region">Region</label>
              <select name="region" id="region" >
                      <option value="">select region</option>
                      <option value="us_west">us-west</option>
                      <option value="af_south">af-south</option>
                      <option value="me_central">me-central</option>
              </select>
            </>
          
          }


          


          <input type="button" onClick={addOnClick} name='addbutton' id='addbutton' value='add Service' />
          
          <button>Submit</button>
          
          

      </form>


      </div>
      
   { isEstimated && <div className='result'>
      <h3>Estimation Summary</h3>
      {estimationMap}
        <div className="price-highlight">
          Total Cost: ₹{cost}
         </div>
      </div>}
    
  
    
    </>
  )
}

export default Form
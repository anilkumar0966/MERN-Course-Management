import { useState, useEffect } from "react";
import axios from 'axios';

function App() {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchCategory, setSearchCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('')

  const loadCourse = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/courses')
      setCourse(response.data)
    } catch (err) {
      console.error("Error loading employees", err);
    } finally {
      setLoading(false);
    }
  }

  const addCourse = async () => {
    if (!courseCode || !courseName || !category || !duration) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/courses', { courseCode, courseName, category, duration:Number(duration) });
      setCourseCode('');
      setCourseName('');
      setCategory('');
      setDuration('');

      loadCourse();
    }
    catch (err) {
      const mssg = err.response?.data?.message || "error adding course";
      alert(mssg);
    }
  }

  const updateCourse = async () => {
    try {
      if (!editId) {
        return
      }
      await axios.put(`http://localhost:5000/api/courses/${editId}`, { courseCode, courseName, category, duration:Number(duration) })
      setEditId(null)
      setCourseCode('');
      setCourseName('');
      setCategory('');
      setDuration('');

      loadCourse()
    }
    catch (err) {
      alert(err.response?.data?.message || "Error updating course");
      console.log({ mssg: 'Error updating course', err: err });
    }
  }

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`)
      loadCourse();
    }
    catch (err) {
      console.log({ mssg: 'error delting course', err: err.message });
    }
  }
  const filteredCourses =
    course
      .sort((a, b) => {
        if (sortOrder === 'asc') return a.duration - b.duration;
        if (sortOrder === 'desc') return b.duration - a.duration;
        return 0;
      })
      .filter((c) =>
        c.category.toLowerCase().includes(searchCategory.toLocaleLowerCase())
      )


  useEffect(() => {
    loadCourse();
  }, []);


  return (
    <>
    
    <div className="card" style={{backgroundColor:"yellowgreen"}}>
      <h2 className="text-center mt-4 mb-4 fw-bold" >Online Course Management System</h2>
    </div>

      <div className="card" style={{backgroundColor:"beige"}}>
        <div className="card-body">
          <div className="row justify-content-center">
            <div className="col-md-6">

              <div className="mb-3">
                <label htmlFor="code" className="form-label mb-2 fw-semibold">
                  Course Code
                </label>
                <input
                  type="text"
                  id="code"
                  className="form-control mb-3"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  required
                />

                <label htmlFor="name" className="form-label mb-2 fw-semibold">
                  Course Name :
                </label>
                <input
                  type="text" id="name"
                  className="form-control mb-3"
                  value={courseName} onChange={(e) => setCourseName(e.target.value)}
                  required
                />

                <label htmlFor="category" className="form-label mb-2 fw-semibold">
                  Category :
                </label>
                <input
                  type="text" id="Category"
                  className="form-control mb-3"
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  required
                />

                <label htmlFor="duration" className="form-label mb-2 fw-semibold">
                  duration (in hours) :
                </label>
                <input
                  type="number" id="duration"
                  className="form-control mb-3"
                  value={duration} onChange={(e) => setDuration(e.target.value)}
                  min={1} max={10}
                  required
                />

                <label htmlFor="search" className="form-label fw-semibold mb-2">
                  Search Category :
                </label>
                <input
                  type="text" className="form-control mb-3"
                  value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}
                />

                <select
                  type='select' className="form-select mb-3"
                  value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="">Sort by duration</option>
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </select>

                <button
                  type="button" className="btn btn-warning me-4"
                  onClick={editId ? updateCourse : addCourse}>
                  {editId ? "Update Course" : "Add Course"}
                </button>

                <button
                  type="button" className="btn btn-primary"
                  disabled={loading}
                  onClick={loadCourse}>
                  Get Course
                </button>


              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && <p className="warning text-center">courses are loading</p>}
      {editId && <p className="warning text-center">Editing course</p>}
      <div className="d-flex justify-content-center">
        <table className="table table-bordered w-75">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {course.length === 0 ? (
              <tr>
                <td colSpan={5}>No data found</td>
              </tr>) :
              (filteredCourses === 0 && searchCategory ?
                <tr>
                  <td colSpan={5}>No data found for this category</td>
                </tr> :
                filteredCourses
                  .map(data => (
                    <tr key={data._id}>
                      <td>{data.courseCode}</td>
                      <td>{data.courseName}</td>
                      <td>{data.category}</td>
                      <td>{data.duration}</td>
                      <td><button
                        type="button" className="btn btn-success btn-sm me-2"
                        onClick={() => {
                          setEditId(data._id)
                          setCourseCode(data.courseCode)
                          setCourseName(data.courseName)
                          setCategory(data.category)
                          setDuration(data.duration)
                        }}>
                        Edit
                      </button>
                        <button
                          type="button" className="btn btn-danger btn-sm"
                          onClick={() => {
                            if (window.confirm(`are you sure to want to delete ${data.courseName}`)) {
                              deleteCourse(data._id)
                            }
                          }}>Delete</button></td>
                    </tr>

                  )))
            }
          </tbody>
        </table>
      </div>

    </>
  );
}

export default App;

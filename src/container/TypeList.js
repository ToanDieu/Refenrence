// import React from "react";
// import PropTypes from "prop-types";
// import { fetchTypeList } from "../actions/case";
// import { bindActionCreators } from "redux";
// import { Link } from "react-router-dom";
// import { connect } from "react-redux";
// import Loading from "../components/Loading";

// class TypeList extends React.Component {
//   componentDidMount() {
//     this.props.fetchTypeList();
//   }
//   render() {
//     let typeID;
//     try {
//       typeID = this.props.match.params.id;
//     } catch (err) {
//       typeID = -1;
//     }
//     const { data, loading, error } = this.props;
//     return (
//       <div>
//         <div>
//           <h1>Type List</h1>
//           {loading ? (
//             <Loading />
//           ) : (
//             <div>
//               {data && data.length
//                 ? data.map(item => (
//                     <Link key={item.id} to={`/type/${item.id}`}>
//                       {item.id} {item.memo}
//                     </Link>
//                   ))
//                 : error ? error : "no data"}
//             </div>
//           )}
//         </div>
//         {typeID ? <BaseList typeID={typeID} /> : null}
//       </div>
//     );
//   }
// }

// TypeList.propTypes = {
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
//     })
//   }),
//   fetchTypeList: PropTypes.func,
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number,
//       memo: PropTypes.string
//     })
//   ),
//   loading: PropTypes.bool,
//   error: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
// };

// const mapState = state => state.typeList || {};

// const mapDispatch = dispatch => {
//   return {
//     fetchTypeList: bindActionCreators(fetchTypeList, dispatch)
//   };
// };

// export default connect(mapState, mapDispatch)(TypeList);

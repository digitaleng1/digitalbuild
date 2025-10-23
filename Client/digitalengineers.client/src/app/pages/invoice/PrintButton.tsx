
const PrintButton = () => {
	return (
		<button className="btn btn-primary me-1" onClick={() => window.print()}>
			<i className="mdi mdi-printer"></i> Print
		</button>
	);
};

export default PrintButton;

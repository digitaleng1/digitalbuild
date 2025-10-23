import SimpleBar, {type Props} from "simplebar-react";

export type ChildrenType = Readonly<{ children: React.ReactNode }>
type SimplebarClientProps = ChildrenType & Props

const SimplebarReactClient = ({ children, ...restProps }: SimplebarClientProps) => {
	return <SimpleBar {...restProps}> {children}</SimpleBar>
}

export default SimplebarReactClient

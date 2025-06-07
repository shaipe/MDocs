/**
 * 分割树形数据
 * @param nodes 原始树形数据
 * @param excludedIds 无权限ID集合
 * @param isParentExcluded 父节点是否被排除（内部递归使用）
 * @returns 分割后的权限树和无权限树
 */
export const splitTreeData = (nodes: any[], excludedIds: Set<number>, isParentExcluded = false): { permitted: any[]; excluded: any[] } => {
	const permitted: any[] = [];
	const excluded: any[] = [];

	nodes.forEach(node => {
		// 当前节点是否被排除
		const isExcluded = excludedIds.has(node.id);

		// 创建新节点（避免修改原始数据）
		const newNode: any = {
			...node,
			children: [],
		};

		// 递归处理子节点
		const childResult = splitTreeData(node.children || [], excludedIds);

		if (isExcluded) {
			// 当前节点被排除，加入排除树
			newNode.children = childResult.excluded;
			excluded.push(newNode);
		} else {
			// 当前节点有权限，加入权限树
			newNode.children = childResult.permitted;
			permitted.push(newNode);

			// 如果子节点中有被排除的项，将当前节点作为父节点加入排除树
			if (childResult.excluded.length > 0) {
				excluded.push({
					...node,
					children: childResult.excluded,
				});
			}
		}
	});

	return { permitted, excluded };
};

/**
 * 根据ID映射对象扩展树节点属性
 * @param tree 原始树结构
 * @param idPropsMap ID到属性的映射对象
 * @returns 扩展后的新树结构
 */
export const extendTreeWithProps = (tree: any[], idPropsMap: Record<string, Record<string, any>>): any[] => {
	return tree.map(node => {
		// 创建新节点（保持不可变性）
		const newNode = { ...node };

		// 如果当前节点ID在映射中，则合并属性
		if (idPropsMap[node.id]) {
			Object.assign(newNode, idPropsMap[node.id]);
		}

		// 递归处理子节点
		if (node.children) {
			newNode.children = extendTreeWithProps(node.children, idPropsMap);
		}

		return newNode;
	});
}

/**
 * 将树形结构转换为指定格式的扁平数组
 * @param tree 树形结构数据
 * @param mappings 字段映射配置
 * @returns 扁平化后的数组
 */
export const flattenTreeWithMappings = (tree: any[], mappings: any[], leafOnly: boolean = false): any[] => {
	const result: any[] = [];

	// 预处理映射配置
	const processedMappings = mappings.map(mapping => {
		if (typeof mapping === 'string') {
			return { label: mapping, value: mapping };
		}
		return mapping;
	});

	// 递归遍历函数
	const traverse = (node: any) => {
		const isLeaf = !node.children || node.children.length === 0;

		// 如果不是leafOnly模式，或者是叶子节点，则处理
		if (!leafOnly || isLeaf) {
			const flatNode: any = {};

			// 应用每个映射规则
			processedMappings.forEach(mapping => {
				flatNode[mapping.label] = node[mapping.value];
			});

			result.push(flatNode);
		}

		// 递归处理子节点
		if (node.children) {
			node.children.forEach(traverse);
		}
	};

	// 遍历整棵树
	tree.forEach(traverse);

	return result;
}

/**
 * 获取树形结构中所有节点的 id（迭代实现）
 * @param nodes 树形结构数据
 * @returns 所有节点的 id 数组
 */
export const getAllValues = (nodes: any[]): number[] => {
	const ids: number[] = [];
	const stack: any[] = [...nodes]; // 使用栈模拟递归

	while (stack.length > 0) {
		const node = stack.pop()!; // 取出栈顶节点
		ids.push(node.id); // 将当前节点的 id 加入数组
		if (node.children) {
			stack.push(...node.children); // 将子节点压入栈中
		}
	}

	return ids;
}

/**
 * 从树形结构中查找指定字段与给定值匹配的节点
 * @param tree 树形结构数据
 * @param field 要匹配的字段名
 * @param value 要匹配的值
 * @returns 匹配的节点对象，如果未找到则返回 null
 */
export const findNodeInTree = (tree: any[], field: string, value: any): any | null => {
	if (!tree || !tree.length) return null;
	
	// 使用栈进行迭代查找，避免递归调用
	const stack: any[] = [...tree];
	
	while (stack.length > 0) {
		const node = stack.pop();
		
		// 检查当前节点是否匹配
		if (node[field] === value) {
			return node;
		}
		
		// 将子节点加入栈中继续查找
		if (node.children && node.children.length) {
			stack.push(...node.children);
		}
	}
	
	// 未找到匹配节点
	return null;
}

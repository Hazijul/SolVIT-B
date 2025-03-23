import { TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const colors = ["#00C49F", "#0088FE", "#FFBB28"];

const collegeExpenseSummary = [
	{ category: "Food", amount: 1200 },
	{ category: "Rent", amount: 3000 },
	{ category: "Transportation", amount: 800 },
	{ category: "Entertainment", amount: 600 },
	{ category: "Shopping", amount: 900 },
];

const expenseSums = collegeExpenseSummary.reduce<Record<string, number>>(
	(acc, item) => {
		acc[`${item.category} Expenses`] = item.amount;
		return acc;
	},
	{}
);

const expenseCategories = Object.entries(expenseSums).map(([name, value]) => ({
	name,
	value,
}));

const totalExpenses = expenseCategories.reduce(
	(acc, category) => acc + category.value,
	0
);
const formattedTotalExpenses = totalExpenses.toFixed(2);

const CardExpenseSummary = () => {
	return (
		<div className="row-span-3 bg-white shadow-md rounded-2xl flex flex-col justify-between">
			{/* HEADER */}
			<div>
				<h2 className="text-lg font-semibold mb-2 px-7 pt-5">
					Expense Summary
				</h2>
				<hr />
			</div>

			{/* BODY */}
			<div className="xl:flex justify-between pr-7">
				{/* CHART */}
				<div className="relative basis-3/5">
					<ResponsiveContainer width="100%" height={140}>
						<PieChart>
							<Pie
								data={expenseCategories}
								innerRadius={50}
								outerRadius={60}
								fill="#8884d8"
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
							>
								{expenseCategories.map((entry, index) => (
									<Cell
										key={`cell-${
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											index
										}`}
										fill={colors[index % colors.length]}
									/>
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center basis-2/5">
						<span className="font-bold text-xl">${formattedTotalExpenses}</span>
					</div>
				</div>

				{/* LABELS */}
				<ul className="flex flex-col justify-around items-center xl:items-start py-5 gap-3">
					{expenseCategories.map((entry, index) => (
						<li
							key={`legend-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								index
							}`}
							className="flex items-center text-xs"
						>
							<span
								className="mr-2 w-3 h-3 rounded-full"
								style={{ backgroundColor: colors[index % colors.length] }}
							/>
							{entry.name}
						</li>
					))}
				</ul>
			</div>

			{/* FOOTER */}
			<div>
				<hr />
				<div className="mt-3 flex justify-between items-center px-7 mb-4">
					<div className="pt-2">
						<p className="text-sm">
							Average:{" "}
							<span className="font-semibold">${formattedTotalExpenses}</span>
						</p>
					</div>
					<span className="flex items-center mt-2">
						<TrendingUp className="mr-2 text-green-500" />
						30%
					</span>
				</div>
			</div>
		</div>
	);
};

export default CardExpenseSummary;

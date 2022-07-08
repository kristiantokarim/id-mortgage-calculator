import {
  Button,
  createTheme,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/system";
import React, { useState } from "react";
import "./App.css";
import { Mortgage, MortgageData } from "./Mortgage";
import { Refinance, RefinanceData } from "./Refinance";
import { v4 } from "uuid";

const theme = createTheme();

const calculateMonthlyMonthlyDetails = (
  initialLoan: number,
  loanSoFar: number,
  tenureInYear: number,
  yearlyRate: number
) => {
  const monthlyRate = yearlyRate / 12;
  const monthlyPayment =
    (initialLoan * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -tenureInYear * 12));
  const monthlyInterestPayment = loanSoFar * monthlyRate;
  const monthlyLoanPayment = monthlyPayment - monthlyInterestPayment;
  return {
    monthlyPayment,
    monthlyInterestPayment,
    monthlyLoanPayment,
    loanLeft: loanSoFar - monthlyLoanPayment,
  };
};
type CalculationResult = {
  monthlyPayment: number;
  monthlyInterestPayment: number;
  monthlyLoanPayment: number;
  loanLeft: number;
  interestPaidSoFar: number;
  administrationFeePaidSoFar: number;
  interestRate: number
};

function App() {
  const [mortgageData, setMortgageData] = useState<MortgageData | undefined>(
    undefined
  );
  const [refinanceData, setRefinanceData] = useState<
    Array<RefinanceData | undefined>
  >([]);
  const [calculationResult, setCalculationResult] = useState<
    { res: CalculationResult[]; type: string }[]
  >([]);

  const onAddButtonClick = () => {
    setRefinanceData([...refinanceData, undefined]);
  };
  const onCalculateButtonClick = () => {
    if (!mortgageData) return;

    const haveUnfinishedRefinanceForm =
      Object.keys(refinanceData).filter((key, _) => !refinanceData[Number(key)])
        .length > 0;
    if (haveUnfinishedRefinanceForm) return;

    let loan = mortgageData.amount;
    let interestPaidSoFar = 0;
    let administrationFeePaidSoFar = 0;
    let initialLoan = mortgageData.amount;
    let tenureLeft = mortgageData.interestRates.length;
    administrationFeePaidSoFar += mortgageData.administrationFee;
    const mortgageCalcRes: CalculationResult[] = [];
    const calcRes: { res: CalculationResult[]; type: string }[] = [];
    for (let i = 0; i < mortgageData.interestRates.length; i++) {
      const interestRate = mortgageData.interestRates[i];
      for (let j = 0; j < 12; j++) {
        const monthlyDetails = calculateMonthlyMonthlyDetails(
          initialLoan,
          loan,
          tenureLeft,
          interestRate / 100
        );
        loan = monthlyDetails.loanLeft;
        interestPaidSoFar += monthlyDetails.monthlyInterestPayment;
        mortgageCalcRes.push({
          ...monthlyDetails,
          interestPaidSoFar,
          administrationFeePaidSoFar,
          interestRate: interestRate / 100,
        });
      }
      tenureLeft -= 1;
      initialLoan = loan;
    }
    calcRes.push({ res: mortgageCalcRes, type: "Mortgage" });

    // refinance
    refinanceData.map((refDet, idx) => {
      const refinanceDetails = refDet!;
      let refinanceLoan =
        calcRes[calcRes.length - 1].res[
          refinanceDetails.monthToStartRefinance - 2
        ].loanLeft *
        (1 + refinanceDetails.penaltyRate / 100);
      let initialRefinanceLoan = refinanceLoan;
      let refinanceTenureLeft = refinanceDetails.interestRates.length;
      administrationFeePaidSoFar += refinanceDetails.administrationFee;
      const refinanceCalcRes: CalculationResult[] = [];
      interestPaidSoFar =
        calcRes[calcRes.length - 1].res[
          refinanceDetails.monthToStartRefinance - 2
        ].interestPaidSoFar;
      for (let i = 0; i < refinanceDetails.interestRates.length; i++) {
        const interestRate = refinanceDetails.interestRates[i];
        for (let j = 0; j < 12; j++) {
          const monthlyDetails = calculateMonthlyMonthlyDetails(
            initialRefinanceLoan,
            refinanceLoan,
            refinanceTenureLeft,
            interestRate / 100
          );
          refinanceLoan = monthlyDetails.loanLeft;
          interestPaidSoFar += monthlyDetails.monthlyInterestPayment;
          refinanceCalcRes.push({
            ...monthlyDetails,
            interestPaidSoFar,
            administrationFeePaidSoFar,
            interestRate: interestRate / 100,
          });
        }
        refinanceTenureLeft -= 1;
        initialRefinanceLoan = refinanceLoan;
      }
      calcRes.push({ res: refinanceCalcRes, type: "Refinance " + (idx+1) });
    });

    setCalculationResult(calcRes);
  };
  const moneyFormatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'IDR'})
  const percentageFormatter = new Intl.NumberFormat('en-US', {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 5})
  
  return (
    <ThemeProvider theme={theme}>
      <Grid container component={"main"} p={2}>
        <Grid item  sx={{display: 'block', textAlign: 'center'}}>
          <Typography variant="h3" minWidth='95vw'>Mortgage Calculator</Typography>
        </Grid>
        <Grid item flexDirection={"column"} p={5} sx={{minHeight: '98vh', overflowX: 'hidden', overflowY: 'scroll'}}>
          <Grid item flexDirection={"row"}>
            <Grid item>
              <Grid item sx={{ display: "inline-block", padding: "1%" }}>
                <Button onClick={onAddButtonClick} variant={"contained"}>
                  <Typography>+ Add Refinance</Typography>
                </Button>
              </Grid>
              <Grid item sx={{ display: "inline-block", padding: "1%" }}>
                <Button onClick={onCalculateButtonClick} variant={"contained"}>
                  <Typography>Calculate</Typography>
                </Button>
              </Grid>
            </Grid>
            <Mortgage setMortgageData={setMortgageData} />
            {refinanceData.map((_, key) => (
              <Refinance
                key={key}
                refinanceIdx={key}
                refinanceData={refinanceData}
                setRefinanceData={setRefinanceData}
              />
            ))}
          </Grid>
        </Grid>
        {calculationResult.length > 0 &&
        <Grid item flexDirection={"row"} p={5} sx={{maxHeight: '100vh', overflowY: 'scroll'}}>
          {calculationResult.map((res, idx) => (
            <Grid item paddingY={1}>
              <TableContainer component={Paper}>
                <Grid item paddingX={2} paddingY={1}>
                  <Typography variant="h5">{res.type}</Typography>
                </Grid>
                <Table sx={{ width: '55vw' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell align="left">Total Monthly Payment in IDR</TableCell>
                      <TableCell align="left">Interest Monthly Payment in IDR</TableCell>
                      <TableCell align="left">Monthly Loan Payment in IDR</TableCell>
                      <TableCell align="left">Loan Left At End of Month in IDR</TableCell>
                      <TableCell align="left">Interest Paid So Far in IDR</TableCell>
                      <TableCell align="left">Administration Fee Paid So Far in IDR</TableCell>
                      <TableCell align="left">Interest Rate in Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {res.res.map((entry, jdx) => (
                    <TableRow>
                      <TableCell>{jdx + 1}</TableCell>
                      <TableCell align="left">{moneyFormatter.format(entry.monthlyPayment)}</TableCell>
                      <TableCell align="left">{moneyFormatter.format(entry.monthlyInterestPayment)}</TableCell>
                      <TableCell align="left">{moneyFormatter.format(entry.monthlyLoanPayment)}</TableCell>
                      <TableCell align="left">{moneyFormatter.format(entry.loanLeft)}</TableCell>
                      <TableCell align="left">{moneyFormatter.format(entry.interestPaidSoFar)}</TableCell>
                      <TableCell align="left">{moneyFormatter.format(entry.administrationFeePaidSoFar)}</TableCell>
                      <TableCell align="left">{percentageFormatter.format(entry.interestRate)}</TableCell>
                    </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ))}
        </Grid>}
      </Grid>
    </ThemeProvider>
  );
}

export default App;

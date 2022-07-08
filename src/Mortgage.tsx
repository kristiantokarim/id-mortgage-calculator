import {
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export type MortgageData = {
  amount: number;
  interestRates: number[];
  administrationFee: number;
};

type Props = {
  setMortgageData: (mortageData: MortgageData | undefined) => void;
};

const updateMortgageData = (
  interestRates: Array<string | undefined> | undefined,
  amount: number | undefined,
  administrationFee: number | undefined,
  setMortgageData: (mortageData: MortgageData | undefined) => void
) => {
  if (
    !amount ||
    !administrationFee ||
    !interestRates ||
    interestRates.length === 0 ||
    interestRates.filter((item) => !item || !parseFloat(item)).length > 0
  ) {
    setMortgageData(undefined);
    return;
  }

  setMortgageData({
    amount,
    administrationFee,
    interestRates: (interestRates as string[]).map((value) => parseFloat(value)),
  });
};

export const Mortgage: React.FC<Props> = (props: Props) => {
  const [interestRates, setInterestRates] = useState<Array<string | undefined>>(
    []
  );
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [administrationFee, setAdministrationFee] = useState<
    number | undefined
  >(undefined);

  const onAddYearButtonClick = (interestRate: string | undefined) => {
    setInterestRates([...interestRates, interestRate]);
    updateMortgageData(
      [...interestRates, interestRate],
      amount,
      administrationFee,
      props.setMortgageData
    );
  };

  const onInterestChange = (newInterest: string, idx: number) => {
    interestRates[idx] = newInterest;
    setInterestRates([...interestRates]);
    updateMortgageData(
      interestRates,
      amount,
      administrationFee,
      props.setMortgageData
    );
  };

  const onCloseButtonClick = (idx: number) => {
    if (idx < interestRates.length) {
      interestRates.splice(idx, 1);
      setInterestRates([...interestRates]);
      updateMortgageData(
        interestRates,
        amount,
        administrationFee,
        props.setMortgageData
      );
    }
  };

  return (
    <>
      <Grid item paddingY={1} width="400px">
        <Paper elevation={3}>
          <Grid item p={5}>
            <Typography variant={"h5"}>Mortgage</Typography>
            <Grid item flexDirection={"row"}>
              <Grid item paddingY={1}>
                <TextField
                  label={"Amount in IDR"}
                  variant={"outlined"}
                  fullWidth
                  onChange={(
                    input: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >
                  ) => {
                    setAmount(Number(input.target.value));
                    updateMortgageData(
                      interestRates,
                      amount,
                      administrationFee,
                      props.setMortgageData
                    );
                  }}
                />
              </Grid>
              <Grid item paddingY={1}>
                <TextField
                  label={"Administration Fee in IDR"}
                  variant={"outlined"}
                  fullWidth
                  onChange={(
                    input: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >
                  ) => {
                    setAdministrationFee(Number(input.target.value));
                    updateMortgageData(
                      interestRates,
                      amount,
                      administrationFee,
                      props.setMortgageData
                    );
                  }}
                />
              </Grid>
              <Grid item flexDirection={"column"} paddingY={1}>
                <Grid item>
                  <Typography variant={"subtitle1"}>
                    Tenure: {interestRates.length} years
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    fullWidth
                    onClick={() => onAddYearButtonClick(undefined)}
                    variant={"contained"}
                  >
                    <Typography>+ Add year</Typography>
                  </Button>
                </Grid>
              </Grid>

              <Grid item flexDirection={"row"} paddingY={1}>
                {interestRates.map((interestRate, idx) => (
                  <Grid
                    key={idx}
                    item
                    flexDirection={"column"}
                    width="100%"
                    paddingY={1}
                  >
                    <TextField
                      label={"Interest percentage on year " + (idx + 1)}
                      variant={"outlined"}
                      value={interestRate}
                      sx={{ minWidth: "80%" }}
                      onChange={(
                        input: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => onInterestChange(input.target.value, idx)}
                    />
                    <Typography
                      width="10%"
                      paddingX={1}
                      sx={{ fontSize: "xx-large" }}
                      variant="caption"
                    >
                      %
                    </Typography>
                    <IconButton
                      tabIndex={-1}
                      onClick={() => onCloseButtonClick(idx)}
                      sx={{ minWidth: "5%" }}
                    >
                      X
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
};

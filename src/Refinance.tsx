import {
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export type RefinanceData = {
  penaltyRate: number;
  monthToStartRefinance: number;
  interestRates: number[];
  administrationFee: number;
};

type Props = {
  setRefinanceData: (
    refinanceData: Array<RefinanceData | undefined>
  ) => void;
  refinanceData: Array<RefinanceData | undefined>;
  refinanceIdx: number;
};

const updateRefinanceData = (
  interestRates: Array<string | undefined> | undefined,
  startingMonth: number | undefined,
  administrationFee: number | undefined,
  penaltyRate: string | undefined,
  refinanceIdx: number,
  refinanceData: Array<RefinanceData | undefined>,
  setRefinanceData: (
    refinanceData: Array<RefinanceData | undefined>
  ) => void
) => {
  if (
    !administrationFee ||
    !penaltyRate ||
    !startingMonth ||
    !interestRates ||
    interestRates.length === 0 ||
    interestRates.filter((value) => !value || !parseFloat(value)).length > 0
  ) {
    refinanceData[refinanceIdx] = undefined;
    setRefinanceData(refinanceData);
    return;
  }
  refinanceData[refinanceIdx] = {
    penaltyRate: parseFloat(penaltyRate),
    monthToStartRefinance: startingMonth,
    interestRates: (interestRates as string[]).map((value) =>
      parseFloat(value)
    ),
    administrationFee,
  };
  setRefinanceData(refinanceData);
};

export const Refinance: React.FC<Props> = (props: Props) => {
  const [interestRates, setInterestRates] = useState<Array<string | undefined>>(
    []
  );
  const [startingMonth, setStartingMonth] = useState<number | undefined>(
    undefined
  );
  const [penaltyRate, setPenaltyRate] = useState<string | undefined>(undefined);
  const [administrationFee, setAdministrationFee] = useState<
    number | undefined
  >(undefined);

  const onAddYearButtonClick = () => {
    setInterestRates([...interestRates, undefined]);
    updateRefinanceData(
      [...interestRates, undefined],
      startingMonth,
      administrationFee,
      penaltyRate,
      props.refinanceIdx,
      props.refinanceData,
      props.setRefinanceData
    );
  };

  const onInterestChange = (newInterest: string, idx: number) => {
    interestRates[idx] = newInterest;
    setInterestRates([...interestRates]);
    updateRefinanceData(
      interestRates,
      startingMonth,
      administrationFee,
      penaltyRate,
      props.refinanceIdx,
      props.refinanceData,
      props.setRefinanceData
    );
  };

  const onCloseButtonClick = (idx: number) => {
    if (idx < interestRates.length) {
      interestRates.splice(idx, 1);
      setInterestRates([...interestRates]);
    }
  };

  const onCloseRefinanceButtonClick = () => {
    props.refinanceData.splice(props.refinanceIdx, 1)
    props.setRefinanceData([...props.refinanceData])
  }

  return (
    <>
      <Grid item paddingY={1}>
        <Paper elevation={3}>
          <Grid item p={5}>
            <Grid item flexDirection={"column"}>
              <Typography paddingRight={1} variant={"h5"} sx={{display: 'inline-block'}}>
                Refinance {props.refinanceIdx + 1}
              </Typography>
              <Button
                tabIndex={-1}
                variant={'outlined'}
                onClick={() => onCloseRefinanceButtonClick()}
                sx={{  minWidth: "5%", display: 'inline-block' }}
              >
                REMOVE REFINANCE
              </Button>
            </Grid>
            <Grid item flexDirection={"row"}>
              <Grid item paddingY={1}>
                <TextField
                  label={"Starting Month"}
                  variant={"outlined"}
                  fullWidth
                  onChange={(
                    input: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >
                  ) => {
                    setStartingMonth(Number(input.target.value));
                    // updateRefinanceData(
                    //   interestRates,
                    //   startingMonth,
                    //   administrationFee,
                    //   penaltyRate,
                    //   props.refinanceIdx,
                    //   props.refinanceData,
                    //   props.setRefinanceData
                    // );
                  }}
                />
              </Grid>
              <Grid item paddingY={1} flexDirection={"column"}>
                <TextField
                  label={"Penalty Rate in percentage"}
                  variant={"outlined"}
                  value={penaltyRate ?? ""}
                  sx={{ width: "85%" }}
                  onChange={(
                    input: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >
                  ) => {
                    const value = input.target.value;
                    setPenaltyRate(value);
                    // updateRefinanceData(
                    //   interestRates,
                    //   startingMonth,
                    //   administrationFee,
                    //   value,
                    //   props.refinanceIdx,
                    //   props.refinanceData,
                    //   props.setRefinanceData
                    // );
                  }}
                />
                <Typography
                  width="10%"
                  paddingX={1}
                  sx={{ fontSize: "xx-large" }}
                  variant="caption"
                >
                  %
                </Typography>
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
                    updateRefinanceData(
                      interestRates,
                      startingMonth,
                      administrationFee,
                      penaltyRate,
                      props.refinanceIdx,
                      props.refinanceData,
                      props.setRefinanceData
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
                    onClick={() => onAddYearButtonClick()}
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

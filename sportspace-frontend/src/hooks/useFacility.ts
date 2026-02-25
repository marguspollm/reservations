import { useEffect, useMemo, useState } from "react";
import type { Facility } from "../models/entities/Facility";
import { getFacility, updateFacility } from "../services/facility.service";
import { useAsyncFetch } from "./useAsyncFetch";
import type { FacilityFormError } from "../models/FormErrors";
import { isChanged, validateFacilityForm } from "../utils/validations";
import { facilityFormActions } from "../utils/facilityFormActions";
import { t } from "i18next";

export function useFacility(facilityId?: string | undefined) {
  const [facility, setFacility] = useState<Facility | null>(null);
  const [initialFacility, setInitialFacility] = useState<Facility | null>(null);

  const [validateError, setValidateError] = useState<FacilityFormError>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    execute: initExecute,
    loading: initLoading,
    error: initError,
  } = useAsyncFetch();

  const {
    execute: formExecute,
    loading: formLoading,
    error: formError,
  } = useAsyncFetch();

  useEffect(() => {
    if (!facilityId) return;

    const fetchFacility = async () => {
      try {
        const data = await initExecute(getFacility, facilityId);
        const normalized = {
          ...data,
          schedules: data.schedules ?? [],
          rooms: data.rooms ?? [],
        };

        setFacility(normalized);
        setInitialFacility(normalized);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    };
    fetchFacility();
  }, [facilityId, initExecute]);

  const isDirty = useMemo(() => {
    return isChanged(facility, initialFacility);
  }, [facility, initialFacility]);

  const formActions = facilityFormActions(setFacility);

  const cancel = () => {
    setValidateError({});
    if (initialFacility) {
      setFacility(initialFacility);
    }
  };

  const save = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!facilityId || !facility) return;
    setValidateError({});

    const errors = validateFacilityForm(facility);

    if (Object.keys(errors).length !== 0) {
      setValidateError(errors);
      return;
    }

    try {
      const res = await formExecute(updateFacility, facilityId, facility);

      setFacility(res);
      setInitialFacility(res);

      setSuccessMessage(t("success.facility.edited"));
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleChange = (field: string, value: unknown) => {
    setFacility(prev => (prev ? { ...prev, [field]: value } : prev));
  };

  return {
    facility,
    setFacility,
    error,
    validateError,
    setValidateError,
    cancel,
    handleChange,
    save,
    isDirty,
    successMessage,
    setSuccessMessage,
    initExecute,
    initLoading,
    initError,
    formError,
    formLoading,
    setError,
    ...formActions,
  };
}
